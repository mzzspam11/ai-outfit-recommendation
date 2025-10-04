import { User, Settings, History, Heart, Palette, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const { profile, user } = useAuth();

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your profile</h2>
          <button
            onClick={() => onNavigate('login')}
            className="px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const stylingHistory = [
    {
      date: 'Today',
      activity: 'Saved outfit to closet',
      outfit: 'Business Elegant',
      time: '2 hours ago',
    },
    {
      date: 'Yesterday',
      activity: 'Completed style quiz',
      outfit: null,
      time: '1 day ago',
    },
    {
      date: '2 days ago',
      activity: 'Liked 3 outfits',
      outfit: 'Casual Chic, Weekend Vibes',
      time: '2 days ago',
    },
    {
      date: '1 week ago',
      activity: 'Added 5 items to closet',
      outfit: null,
      time: '1 week ago',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User size={40} className="text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
              <p className="text-gray-600 mb-1">{profile.email}</p>
              <p className="text-sm text-gray-500">Member since {profile.member_since}</p>
            </div>

            <button
              onClick={() => onNavigate('edit-profile')}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              <Settings size={18} />
              Edit Profile
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart size={20} className="text-gray-700" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">24</div>
              <div className="text-sm text-gray-600">Liked Outfits</div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <Palette size={20} className="text-gray-700" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">18</div>
              <div className="text-sm text-gray-600">Closet Items</div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock size={20} className="text-gray-700" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
              <div className="text-sm text-gray-600">Quizzes Taken</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <User size={20} className="text-gray-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Saved Preferences</h2>
            </div>

            <div className="space-y-4">
              {profile.gender && (
                <div className="flex justify-between items-start py-3 border-b border-gray-100">
                  <span className="text-gray-600">Gender</span>
                  <span className="font-medium text-gray-900 text-right">{profile.gender}</span>
                </div>
              )}

              {profile.style && (
                <div className="flex justify-between items-start py-3 border-b border-gray-100">
                  <span className="text-gray-600">Style</span>
                  <span className="font-medium text-gray-900 text-right">{profile.style}</span>
                </div>
              )}

              {profile.colors && (
                <div className="flex justify-between items-start py-3 border-b border-gray-100">
                  <span className="text-gray-600">Color Palette</span>
                  <span className="font-medium text-gray-900 text-right">{profile.colors}</span>
                </div>
              )}

              {profile.fit && (
                <div className="flex justify-between items-start py-3 border-b border-gray-100">
                  <span className="text-gray-600">Preferred Fit</span>
                  <span className="font-medium text-gray-900 text-right">{profile.fit}</span>
                </div>
              )}

              {profile.occasions && (
                <div className="flex justify-between items-start py-3 border-b border-gray-100">
                  <span className="text-gray-600">Occasions</span>
                  <span className="font-medium text-gray-900 text-right">{profile.occasions}</span>
                </div>
              )}

              {profile.comfort_level && (
                <div className="flex justify-between items-start py-3">
                  <span className="text-gray-600">Comfort Level</span>
                  <span className="font-medium text-gray-900 text-right">{profile.comfort_level}</span>
                </div>
              )}

              {!profile.gender && !profile.style && !profile.colors && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No style preferences saved yet</p>
                  <button
                    onClick={() => onNavigate('edit-profile')}
                    className="text-sm text-gray-900 font-medium hover:underline"
                  >
                    Add preferences
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('quiz')}
              className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Update Preferences
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <History size={20} className="text-gray-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Styling History</h2>
            </div>

            <div className="space-y-4">
              {stylingHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0" />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{item.activity}</h3>
                      <span className="text-xs text-gray-500">{item.time}</span>
                    </div>

                    {item.outfit && (
                      <p className="text-sm text-gray-600 mb-1">{item.outfit}</p>
                    )}

                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              View All Activity
            </button>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-700 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to refresh your style?</h2>
          <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
            Take our quiz again to get updated recommendations based on your evolving taste
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('quiz')}
              className="px-8 py-4 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Retake Style Quiz
            </button>
            <button
              onClick={() => onNavigate('recommendation')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors"
            >
              Browse Outfits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
