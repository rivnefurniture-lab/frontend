"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CountryDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    facebook: "",
    twitter: "",
    linkedin: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Load user profile on mount
  useEffect(() => {
    if (!user) return;
    console.log(user);

    setProfile({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      country: user.country || "",
      facebook: user.facebook || "",
      twitter: user.twitter || "",
      linkedin: user.linkedin || "",
    });

    setLoading(false);
  }, [user]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const onSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);

    if (!validateEmail(profile.email)) {
      setError("Please enter a valid email address.");
      setSaving(false);
      return;
    }

    try {
      if (profile.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profile.email,
        });
        if (emailError) throw emailError;
      }

      const { error: metaError } = await supabase.auth.updateUser({
        data: {
          name: profile.name,
          phone: profile.phone,
          country: profile.country,
          facebook: profile.facebook,
          twitter: profile.twitter,
          linkedin: profile.linkedin,
        },
      });

      if (metaError) throw metaError;

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="container py-10 max-w-2xl">
      <Card>
        <CardContent>
          <h1 className="text-2xl font-semibold mb-1">Profile & Settings</h1>
          <p className="text-gray-600 mb-6">
            Manage your personal info, security, and social links.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Personal Info */}
            <Input
              placeholder="Full name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
            <CountryDropdown
              value={profile.country}
              onChange={(val) => setProfile({ ...profile, country: val })}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 text-gray-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <PhoneInput
              country={"us"}
              value={profile.phone}
              onChange={(phone) => setProfile({ ...profile, phone })}
              inputClass="w-full! h-11! pl-12! pr-4! rounded-xl! border! border-gray-200! text-gray-900! placeholder-gray-400! focus:outline-none! focus:ring-2! focus:ring-blue-500!"
              placeholder="Phone number"
            />
            {/* Social Links */}
            <Input
              placeholder="Facebook"
              value={profile.facebook}
              onChange={(e) =>
                setProfile({ ...profile, facebook: e.target.value })
              }
            />
            <Input
              placeholder="Twitter"
              value={profile.twitter}
              onChange={(e) =>
                setProfile({ ...profile, twitter: e.target.value })
              }
            />
            <Input
              placeholder="LinkedIn"
              value={profile.linkedin}
              onChange={(e) =>
                setProfile({ ...profile, linkedin: e.target.value })
              }
            />
          </div>

          {error && <p className="text-red-600 mt-4">{error}</p>}
          {message && <p className="text-green-600 mt-4">{message}</p>}

          <Button className="mt-6" onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
