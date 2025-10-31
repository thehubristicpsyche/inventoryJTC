import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
          <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center">
            <User className="h-10 w-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
            <p className="text-gray-600 capitalize">{user.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-gray-900 capitalize">{user.role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;






