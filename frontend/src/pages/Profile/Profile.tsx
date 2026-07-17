import React, { useState, useEffect, useRef } from 'react';
import { 
  User as UserIcon, 
  Camera, 
  Check, 
  Edit2, 
  Mail, 
  Calendar, 
  Clock, 
  Activity
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';
import { storage } from '../../firebase/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

interface ProfileSettingsState {
  username: string;
  email: string;
  bio: string;
  photoURL: string;
  createdAt?: string;
  updatedAt?: string;
}

const skeletonStyle = {
  background: 'rgba(255, 255, 255, 0.04)',
  borderRadius: '4px',
  animation: 'pulse 1.8s infinite ease-in-out'
};

const ProfileSkeleton = () => (
  <div className="glass-card animate-fade-in" style={{ maxWidth: '640px', width: '100%', padding: '36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
      <div style={{ ...skeletonStyle, width: '20px', height: '20px' }}></div>
      <div style={{ ...skeletonStyle, width: '150px', height: '20px' }}></div>
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
      <div style={{ ...skeletonStyle, width: '120px', height: '120px', borderRadius: '50%' }}></div>
      <div style={{ ...skeletonStyle, width: '140px', height: '18px', marginTop: '16px' }}></div>
      <div style={{ ...skeletonStyle, width: '100px', height: '14px', marginTop: '8px' }}></div>
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px' }}>
      <div style={{ ...skeletonStyle, width: '100%', height: '40px', borderRadius: '6px' }}></div>
      <div style={{ ...skeletonStyle, width: '100%', height: '40px', borderRadius: '6px' }}></div>
      <div style={{ ...skeletonStyle, width: '100%', height: '80px', borderRadius: '6px' }}></div>
    </div>
  </div>
);

export default function Profile() {
  const { user, loginUser } = useAuthContext();
  
  // View & Edit Mode States
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // States for Display View Mode & Inputs Edit Mode
  const [settings, setSettings] = useState<ProfileSettingsState>({
    username: "",
    email: "",
    bio: "",
    photoURL: "",
    createdAt: "",
    updatedAt: ""
  });

  const [editSettings, setEditSettings] = useState<ProfileSettingsState>({
    username: "",
    email: "",
    bio: "",
    photoURL: ""
  });

  // Local state for profile picture preview in Edit Mode
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Fetch details from backend profile service
  useEffect(() => {
    if (!user?.email) return;

    const fetchUserProfile = async () => {
      try {
        setLoadingProfile(true);
        const data = await userService.getProfile();
        
        if (data.success && data.user) {
          const loadedData = {
            username: data.user.fullName,
            email: data.user.email,
            bio: data.user.bio || "",
            photoURL: data.user.photoURL || "",
            createdAt: data.user.createdAt || "",
            updatedAt: data.user.updatedAt || ""
          };
          setSettings(loadedData);
          setEditSettings(loadedData);
        }
      } catch (err) {
        console.error("Error fetching profile via backend:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Handle image upload selection
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setPhotoError("Please upload an image smaller than 1MB.");
        return;
      }
      setPhotoError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Str = reader.result as string;
        setSelectedImage(base64Str);
        setEditSettings(prev => ({
          ...prev,
          photoURL: base64Str // preview image
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoError(null);
    setSelectedImage(""); // Sentinel for removal
    setEditSettings(prev => ({
      ...prev,
      photoURL: "" // clear preview
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Discard changes & close edit mode
  const handleCancel = () => {
    setSelectedImage(null);
    setPhotoError(null);
    setEditSettings({ ...settings });
    setIsEditMode(false);
  };

  // Submit and update document details via backend update profile service
  const handleSave = async () => {
    if (!user?.email || saving) return;
    setSaving(true);
    setSaveStatus('saving');

    try {
      const email = user.email.toLowerCase();
      let finalPhotoURL = settings.photoURL;

      // If a new photo was selected, upload it to Firebase Storage
      if (selectedImage && selectedImage !== "") {
        try {
          const storageRef = ref(storage, `profiles/${email}/avatar`);
          await uploadString(storageRef, selectedImage, 'data_url');
          finalPhotoURL = await getDownloadURL(storageRef);
        } catch (storageErr) {
          console.error("Firebase Storage Upload failed, falling back to Base64:", storageErr);
          // Fallback to storing Base64 string directly if storage is blocked
          finalPhotoURL = selectedImage;
        }
      } else if (selectedImage === "") {
        finalPhotoURL = "";
      }

      const res = await userService.updateProfile(
        editSettings.username,
        editSettings.bio,
        finalPhotoURL
      );

      if (res.success && res.user) {
        // Update auth context state to propagate custom picture
        if (loginUser) {
          loginUser(
            { fullName: res.user.fullName, email: res.user.email, photoURL: res.user.photoURL },
            localStorage.getItem('auth_token') || ""
          );
        }

        setSettings({
          username: res.user.fullName,
          email: res.user.email,
          bio: res.user.bio || "",
          photoURL: res.user.photoURL || "",
          updatedAt: res.user.updatedAt || new Date().toISOString(),
          createdAt: settings.createdAt // retain original
        });

        setSelectedImage(null);
        setPhotoError(null);
        setSaveStatus('success');

        // Auto-return to View Mode after successful save animation delay
        setTimeout(() => {
          setIsEditMode(false);
          setSaveStatus('idle');
          setSaving(false);
        }, 1500);
      } else {
        throw new Error("Backend save failed");
      }

    } catch (err) {
      console.error("Error updating user profile details:", err);
      alert("Failed to update profile. Server or Storage error.");
      setSaveStatus('idle');
      setSaving(false);
    }
  };


  // Render Skeleton Loader while loading
  if (loadingProfile) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
      <div className="glass-card" style={{ maxWidth: '640px', width: '100%', padding: '36px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-main)' }}>
            <UserIcon size={20} color="#00F2FE" />
            <h2 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px' }}>
              {isEditMode ? "Edit Profile Settings" : "Profile Overview"}
            </h2>
          </div>
          {!isEditMode && (
            <button 
              onClick={() => setIsEditMode(true)}
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Edit2 size={12} /> Edit Profile
            </button>
          )}
        </div>

        {/* PROFILE VIEW MODE */}
        {!isEditMode ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
              {/* Circular Avatar */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: '#0D1322',
                border: '2px solid #8B5CF6',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
                marginBottom: '16px'
              }}>
                {settings.photoURL ? (
                  <img 
                    src={settings.photoURL} 
                    alt="Profile Avatar" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <UserIcon size={48} color="var(--color-text-dark)" />
                )}
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '6px' }}>
                {settings.username}
              </h3>
              
              <span style={{
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
                fontSize: '11px',
                padding: '2px 10px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: '600'
              }}>
                <Activity size={10} /> Active / Online
              </span>
            </div>

            {/* View Details Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '24px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={16} color="var(--color-text-muted)" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-dark)', fontWeight: '600' }}>Email Address</span>
                  <span style={{ fontSize: '13.5px', color: 'var(--color-text-main)' }}>{settings.email}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <UserIcon size={16} color="var(--color-text-muted)" style={{ marginTop: '2px' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-dark)', fontWeight: '600' }}>Short Bio</span>
                  <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', lineHeight: '1.6', margin: 0 }}>
                    {settings.bio || "No bio added yet."}
                  </p>
                </div>
              </div>

              {/* Timestamp Meta */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={14} color="var(--color-text-dark)" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-dark)' }}>Member Since</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      {settings.createdAt ? new Date(settings.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={14} color="var(--color-text-dark)" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-dark)' }}>Last Updated</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      {settings.updatedAt ? new Date(settings.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EDIT MODE FORM */
          <div>
            {/* Uploader circular image */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
              <div 
                onClick={triggerFileInput}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: '#0D1322',
                  border: '2px solid #8B5CF6',
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                }}
              >
                {editSettings.photoURL ? (
                  <img 
                    src={editSettings.photoURL} 
                    alt="Upload Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <UserIcon size={48} color="var(--color-text-dark)" />
                )}

                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(4, 7, 17, 0.6)',
                  opacity: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'opacity 0.2s ease',
                  color: '#fff'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  <Camera size={20} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button 
                  onClick={triggerFileInput}
                  className="btn btn-secondary" 
                  style={{ padding: '6px 14px', fontSize: '12px', gap: '6px' }}
                >
                  <Camera size={14} /> Change Photo
                </button>
                {editSettings.photoURL && (
                  <button 
                    onClick={handleRemovePhoto}
                    className="btn btn-secondary" 
                    style={{ 
                      padding: '6px 14px', 
                      fontSize: '12px', 
                      gap: '6px', 
                      color: '#EF4444', 
                      borderColor: 'rgba(239, 68, 68, 0.25)', 
                      background: 'rgba(239, 68, 68, 0.04)' 
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.04)'; }}
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              {photoError && (
                <div style={{
                  marginTop: '12px',
                  color: '#EF4444',
                  fontSize: '12px',
                  background: 'rgba(239, 68, 68, 0.06)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontWeight: '600',
                  animation: 'fadeIn 0.2s ease',
                  width: '100%',
                  maxWidth: '300px'
                }}>
                  {photoError}
                </div>
              )}

              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>

            {/* Input fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editSettings.username}
                  onChange={(e) => setEditSettings({ ...editSettings, username: e.target.value })}
                  placeholder="Enter full name"
                  style={{
                    width: '100%',
                    background: '#050811',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: 'var(--color-text-main)',
                    fontSize: '13.5px',
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#8B5CF6'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={editSettings.email}
                  readOnly
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: 'var(--color-text-dark)',
                    fontSize: '13.5px',
                    outline: 'none',
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                  Short Bio
                </label>
                <textarea
                  value={editSettings.bio}
                  onChange={(e) => setEditSettings({ ...editSettings, bio: e.target.value })}
                  placeholder="Tell us about yourself, your tech stack, or projects you are working on..."
                  style={{
                    width: '100%',
                    background: '#050811',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: 'var(--color-text-main)',
                    fontSize: '13.5px',
                    outline: 'none',
                    resize: 'none',
                    minHeight: '100px',
                    transition: 'border 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#8B5CF6'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                />
              </div>
            </div>

            {/* Control buttons with Save Status */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleCancel}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '12px' }}
                disabled={saving}
              >
                Cancel
              </button>
              
              <button 
                onClick={handleSave}
                className="btn btn-gradient"
                style={{ flex: 1, padding: '12px', background: 'var(--button-gradient)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                disabled={saving}
              >
                {saveStatus === 'saving' && (
                  <span style={{ fontSize: '13px' }}>Saving...</span>
                )}
                {saveStatus === 'success' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Profile Updated Successfully</span>
                )}
                {saveStatus === 'idle' && (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
