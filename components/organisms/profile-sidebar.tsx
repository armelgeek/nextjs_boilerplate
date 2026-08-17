'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from '@/components/molecules/forms/profile-form';
import { PasswordChangeForm } from '@/components/molecules/forms/password-change-form';
import { TwoFactorSettings } from '@/components/templates/two-factor-settings';

interface ProfileSidebarProps {
  userData: any;
}

export function ProfileSidebar({ userData }: ProfileSidebarProps) {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar Navigation */}
      <div className="md:col-span-1">
        <nav className="space-y-1 sticky top-10">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'profile'
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'security'
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            Security
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="md:col-span-3 space-y-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={{
                ...userData,
                phone: userData.phone || "",
              }} />
            </CardContent>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PasswordChangeForm />
              </CardContent>
            </Card>
            {process.env.NEXT_PUBLIC_ENABLE_TWO_FACTOR !== "false" && (
              <TwoFactorSettings />
            )}
          </>
        )}
      </div>
    </div>
  );
}
