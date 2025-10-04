import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Camera, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface EditProfileProps {
  onNavigate: (page: string) => void;
  onClose: () => void;
}

export default function EditProfile({ onNavigate, onClose }: EditProfileProps) {
  const { profile, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [gender, setGender] = useState('');
  const [style, setStyle] = useState('');
  const [colors, setColors] = useState('');
  const [fit, setFit] = useState('');
  const [occasions, setOccasions] = useState('');
  const [comfortLevel, setComfortLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAvatarUrl(profile.avatar_url || '');
      setGender(profile.gender || '');
      setStyle(profile.style || '');
      setColors(profile.colors || '');
      setFit(profile.fit || '');
      setOccasions(profile.occasions || '');
      setComfortLevel(profile.comfort_level || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await updateProfile({
      name,
      avatar_url: avatarUrl,
      gender,
      style,
      colors,
      fit,
      occasions,
      comfort_level: comfortLevel,
    });

    setLoading(false);

    if (!error) {
      setSuccess(true);
      setTimeout(() => {
        onNavigate('profile');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
            <p className="text-gray-600">Update your personal information and style preferences</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={20} className="text-gray-700" />
          </button>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-600 font-medium">Profile updated successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture URL
                </label>
                <div className="relative">
                  <Camera size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                {avatarUrl && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={avatarUrl}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <UserIcon size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={profile?.email || ''}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Style Preferences</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                <input
                  type="text"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="e.g., Minimalist & Clean"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Palette</label>
                <input
                  type="text"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="e.g., Neutral tones"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Fit</label>
                <input
                  type="text"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="e.g., Fitted & Tailored"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occasions</label>
                <input
                  type="text"
                  value={occasions}
                  onChange={(e) => setOccasions(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="e.g., Mix of everything"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comfort Level</label>
                <input
                  type="text"
                  value={comfortLevel}
                  onChange={(e) => setComfortLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="e.g., Equal balance"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
