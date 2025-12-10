"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Camera,
  Check,
  Eye,
  EyeOff,
  Heart,
  Key,
  Lightbulb,
  Loader2,
  Mail,
  Pencil,
  Settings,
  Sparkles,
  Target,
  User,
  X,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserProfile } from "@/lib/db/schema";
import { fetcher, cn } from "@/lib/utils";

type TabId = "account" | "profile" | "personality" | "goals" | "context";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface AccountInfo {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  hasPassword: boolean;
}

const tabs: Tab[] = [
  {
    id: "account",
    label: "Account",
    icon: Settings,
    description: "Email, name & password",
  },
  {
    id: "profile",
    label: "Basic Info",
    icon: User,
    description: "Your name and what you do",
  },
  {
    id: "personality",
    label: "Personality",
    icon: Sparkles,
    description: "Skills and hobbies",
  },
  {
    id: "goals",
    label: "Goals & Feelings",
    icon: Target,
    description: "Motivations and emotional state",
  },
  {
    id: "context",
    label: "Additional Context",
    icon: Heart,
    description: "Anything else to share",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function ProfilePage() {
  const {
    data: profile,
    isLoading: isProfileLoading,
    mutate: mutateProfile,
  } = useSWR<UserProfile | null>("/api/profile", fetcher);

  const {
    data: account,
    isLoading: isAccountLoading,
    mutate: mutateAccount,
  } = useSWR<AccountInfo>("/api/account", fetcher);

  const [activeTab, setActiveTab] = useState<TabId>("account");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Profile form data
  const [formData, setFormData] = useState({
    displayName: "",
    occupation: "",
    skills: "",
    hobbies: "",
    motivations: "",
    currentFeelings: "",
    additionalContext: "",
  });

  // Account form data
  const [accountFormData, setAccountFormData] = useState({
    name: "",
  });

  // Password form data
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Image upload state
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName ?? "",
        occupation: profile.occupation ?? "",
        skills: profile.skills ?? "",
        hobbies: profile.hobbies ?? "",
        motivations: profile.motivations ?? "",
        currentFeelings: profile.currentFeelings ?? "",
        additionalContext: profile.additionalContext ?? "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (account) {
      setAccountFormData({
        name: account.name ?? "",
      });
    }
  }, [account]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeTab === "account") {
        const response = await fetch("/api/account", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(accountFormData),
        });

        if (!response.ok) {
          throw new Error("Failed to save account");
        }

        await mutateAccount();
      } else {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to save profile");
        }

        await mutateProfile();
      }

      setIsEditing(false);
      toast.success("Saved successfully!");
    } catch (_error) {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    if (passwordFormData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordFormData.currentPassword,
          newPassword: passwordFormData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password");
      }

      toast.success("Password updated successfully!");
      setPasswordFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (activeTab === "account") {
      if (account) {
        setAccountFormData({ name: account.name ?? "" });
      }
      setIsChangingPassword(false);
      setPasswordFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else if (profile) {
      setFormData({
        displayName: profile.displayName ?? "",
        occupation: profile.occupation ?? "",
        skills: profile.skills ?? "",
        hobbies: profile.hobbies ?? "",
        motivations: profile.motivations ?? "",
        currentFeelings: profile.currentFeelings ?? "",
        additionalContext: profile.additionalContext ?? "",
      });
    }
    setIsEditing(false);
  };

  const isLoading = isProfileLoading || isAccountLoading;

  if (isLoading) {
    return (
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="size-8 text-orange-600" />
        </motion.div>
      </div>
    );
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploadingImage(true);

    try {
      // Get ImageKit auth params
      const authRes = await fetch("/api/upload");
      if (!authRes.ok) throw new Error("Failed to get upload credentials");
      const authParams = await authRes.json();

      // Upload to ImageKit
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", `profile_${Date.now()}`);
      formData.append(
        "publicKey",
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""
      );
      formData.append("signature", authParams.signature);
      formData.append("expire", authParams.expire.toString());
      formData.append("token", authParams.token);
      formData.append("folder", "/profiles");

      const uploadRes = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadRes.ok) throw new Error("Upload failed");
      const uploadData = await uploadRes.json();

      // Update user image in database
      const updateRes = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uploadData.url }),
      });

      if (!updateRes.ok) throw new Error("Failed to update profile");

      await mutateAccount();
      toast.success("Profile image updated!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const renderAccountTab = () => (
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <motion.div
        className="rounded-lg border border-orange-100 bg-orange-50/30 p-4 dark:border-orange-900/30 dark:bg-orange-950/20"
        layout
      >
        <div className="mb-2 flex items-center gap-2">
          <Camera className="size-4 text-orange-600 dark:text-orange-400" />
          <span className="font-medium text-orange-900 dark:text-orange-100">
            Profile Picture
          </span>
        </div>
        <p className="mb-4 text-sm text-orange-700/60 dark:text-orange-300/60">
          Upload a profile picture. Max 5MB.
        </p>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="relative size-20 overflow-hidden rounded-full border-2 border-orange-200 bg-orange-100 dark:border-orange-700 dark:bg-orange-900/50">
              {account?.image ? (
                <Image
                  src={account.image}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-orange-500 text-white font-bold text-2xl">
                  {(account?.name || account?.email || "U")[0].toUpperCase()}
                </div>
              )}
              {isUploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="size-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <button
              className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg transition-colors hover:bg-orange-700 disabled:opacity-50"
              disabled={isUploadingImage}
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              <Camera className="size-4" />
            </button>
            <input
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              ref={fileInputRef}
              type="file"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-orange-900 dark:text-orange-100">
              {account?.image
                ? "Click the camera to change your photo"
                : "Add a profile picture"}
            </p>
            <p className="text-xs text-orange-600/60 dark:text-orange-400/60">
              JPG, PNG or GIF. Max 5MB.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Email - Always disabled */}
      <motion.div
        className="rounded-lg border border-orange-100 bg-orange-50/30 p-4 dark:border-orange-900/30 dark:bg-orange-950/20"
        layout
      >
        <div className="mb-2 flex items-center gap-2">
          <Mail className="size-4 text-orange-600 dark:text-orange-400" />
          <span className="font-medium text-orange-900 dark:text-orange-100">
            Email Address
          </span>
        </div>
        <p className="mb-3 text-sm text-orange-700/60 dark:text-orange-300/60">
          Your email is used for login and cannot be changed.
        </p>
        <Input
          className="border-orange-200 bg-zinc-100 dark:border-orange-800 dark:bg-zinc-800 cursor-not-allowed opacity-70"
          disabled
          value={account?.email ?? ""}
        />
      </motion.div>

      {/* Name - Editable */}
      <motion.div
        className="rounded-lg border border-orange-100 bg-orange-50/30 p-4 dark:border-orange-900/30 dark:bg-orange-950/20"
        layout
      >
        <div className="mb-2 flex items-center gap-2">
          <User className="size-4 text-orange-600 dark:text-orange-400" />
          <span className="font-medium text-orange-900 dark:text-orange-100">
            Name
          </span>
        </div>
        <p className="mb-3 text-sm text-orange-700/60 dark:text-orange-300/60">
          Your account name. This is different from your spiritual companion
          display name.
        </p>
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="edit"
            >
              <Input
                className="border-orange-200 bg-white focus:border-orange-400 focus:ring-orange-400 dark:border-orange-800 dark:bg-zinc-800"
                name="name"
                onChange={handleAccountChange}
                placeholder="Your display name"
                value={accountFormData.name}
              />
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="view"
            >
              {accountFormData.name ? (
                <p className="text-orange-900 dark:text-orange-100">
                  {accountFormData.name}
                </p>
              ) : (
                <p className="italic text-orange-500/50 dark:text-orange-400/50">
                  Not set yet
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Password Section */}
      {account?.hasPassword && (
        <motion.div
          className="rounded-lg border border-orange-100 bg-orange-50/30 p-4 dark:border-orange-900/30 dark:bg-orange-950/20"
          layout
        >
          <div className="mb-2 flex items-center gap-2">
            <Key className="size-4 text-orange-600 dark:text-orange-400" />
            <span className="font-medium text-orange-900 dark:text-orange-100">
              Password
            </span>
          </div>
          <p className="mb-3 text-sm text-orange-700/60 dark:text-orange-300/60">
            Change your password by entering your current one first.
          </p>

          <AnimatePresence mode="wait">
            {isChangingPassword ? (
              <motion.div
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
                exit={{ opacity: 0, height: 0 }}
                initial={{ opacity: 0, height: 0 }}
                key="password-form"
              >
                <div className="space-y-2">
                  <Label className="text-orange-900 dark:text-orange-100">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      className="border-orange-200 bg-white pr-10 focus:border-orange-400 focus:ring-orange-400 dark:border-orange-800 dark:bg-zinc-800"
                      name="currentPassword"
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordFormData.currentPassword}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                      type="button"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-orange-900 dark:text-orange-100">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      className="border-orange-200 bg-white pr-10 focus:border-orange-400 focus:ring-orange-400 dark:border-orange-800 dark:bg-zinc-800"
                      name="newPassword"
                      onChange={handlePasswordChange}
                      placeholder="Enter new password (min 8 chars)"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordFormData.newPassword}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                      type="button"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-orange-900 dark:text-orange-100">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      className="border-orange-200 bg-white pr-10 focus:border-orange-400 focus:ring-orange-400 dark:border-orange-800 dark:bg-zinc-800"
                      name="confirmPassword"
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordFormData.confirmPassword}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      type="button"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    className="border-orange-200 text-orange-800 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-200 dark:hover:bg-orange-900/30"
                    disabled={isSaving}
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordFormData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-orange-600 text-white hover:bg-orange-700"
                    disabled={
                      isSaving ||
                      !passwordFormData.currentPassword ||
                      !passwordFormData.newPassword ||
                      !passwordFormData.confirmPassword
                    }
                    onClick={handlePasswordSubmit}
                    size="sm"
                  >
                    {isSaving ? (
                      <Loader2 className="mr-1 size-4 animate-spin" />
                    ) : (
                      <Check className="mr-1 size-4" />
                    )}
                    Update Password
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="password-button"
              >
                <Button
                  className="border-orange-200 text-orange-800 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-200 dark:hover:bg-orange-900/30"
                  onClick={() => setIsChangingPassword(true)}
                  size="sm"
                  variant="outline"
                >
                  <Key className="mr-2 size-4" />
                  Change Password
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );

  const renderTabContent = () => {
    if (activeTab === "account") {
      return renderAccountTab();
    }

    const content: Record<Exclude<TabId, "account">, JSX.Element> = {
      profile: (
        <div className="space-y-6">
          <FieldSection
            description="This is how your spiritual companion will address you in conversations."
            icon={User}
            isEditing={isEditing}
            label="Display Name"
            name="displayName"
            onChange={handleChange}
            placeholder="Your preferred name or nickname"
            type="input"
            value={formData.displayName}
          />
          <FieldSection
            description="Your work, profession, or current role in life."
            icon={Briefcase}
            isEditing={isEditing}
            label="Occupation"
            name="occupation"
            onChange={handleChange}
            placeholder="What do you do?"
            type="input"
            value={formData.occupation}
          />
        </div>
      ),
      personality: (
        <div className="space-y-6">
          <FieldSection
            description="Technical abilities, social skills, creative talents, or anything you're good at."
            icon={Lightbulb}
            isEditing={isEditing}
            label="Skills & Strengths"
            name="skills"
            onChange={handleChange}
            placeholder="What are your strengths and abilities?"
            type="textarea"
            value={formData.skills}
          />
          <FieldSection
            description="Activities and interests that bring you joy and fulfillment."
            icon={Heart}
            isEditing={isEditing}
            label="Hobbies & Interests"
            name="hobbies"
            onChange={handleChange}
            placeholder="Reading, music, sports, meditation..."
            type="textarea"
            value={formData.hobbies}
          />
        </div>
      ),
      goals: (
        <div className="space-y-6">
          <FieldSection
            description="What drives you? What are you working towards in life?"
            icon={Target}
            isEditing={isEditing}
            label="Motivations & Goals"
            name="motivations"
            onChange={handleChange}
            placeholder="Your dreams, aspirations, and driving forces"
            type="textarea"
            value={formData.motivations}
          />
          <FieldSection
            description="How you're feeling lately. This helps personalize guidance to your current state."
            icon={Sparkles}
            isEditing={isEditing}
            label="Current Emotional State"
            name="currentFeelings"
            onChange={handleChange}
            placeholder="How are you feeling these days?"
            type="textarea"
            value={formData.currentFeelings}
          />
        </div>
      ),
      context: (
        <div className="space-y-6">
          <FieldSection
            description="Any other context that would help your spiritual companion understand you better."
            icon={Heart}
            isEditing={isEditing}
            label="Additional Context"
            name="additionalContext"
            onChange={handleChange}
            placeholder="Values, beliefs, struggles, life situations, or anything else on your mind..."
            type="textarea"
            value={formData.additionalContext}
          />
        </div>
      ),
    };

    return content[activeTab as Exclude<TabId, "account">];
  };

  const activeTabData = tabs.find((t) => t.id === activeTab)!;
  const showEditButton = activeTab !== "account" || !isChangingPassword;

  return (
    <motion.main
      animate={{ opacity: 1 }}
      className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            asChild
            className="border-orange-200 text-orange-800 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-200 dark:hover:bg-orange-900/30"
            size="icon"
            variant="outline"
          >
            <Link href="/chat">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-orange-900 dark:text-orange-50 sm:text-3xl">
              Profile Settings
            </h1>
            <p className="text-sm text-orange-700/70 dark:text-orange-300/70">
              Manage your account and personalization settings
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <nav className="w-full shrink-0 lg:w-64">
          <div className="rounded-xl border border-orange-200/50 bg-white/80 p-2 shadow-lg backdrop-blur-sm dark:border-orange-800/50 dark:bg-zinc-900/80">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  className={cn(
                    "relative flex w-full items-center gap-3 rounded-lg px-3 py-3 mt-1 cursor-pointer text-left transition-colors",
                    isActive
                      ? "text-orange-900 dark:text-orange-50"
                      : "text-orange-700/70 hover:bg-orange-50 hover:text-orange-900 dark:text-orange-300/70 dark:hover:bg-orange-900/20 dark:hover:text-orange-50"
                  )}
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (isEditing) handleCancel();
                  }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-orange-100 dark:bg-orange-900/30"
                      layoutId="activeTab"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon className="relative z-10 size-5" />
                  <div className="relative z-10">
                    <div className="text-sm font-medium">{tab.label}</div>
                    <div className="hidden text-xs opacity-60 sm:block">
                      {tab.description}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <p className="mt-4 px-2 text-xs text-orange-600/50 dark:text-orange-400/50">
            🔒 Your profile is private and only used to personalize your
            spiritual journey.
          </p>
        </nav>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            className="rounded-xl border border-orange-200/50 bg-white/80 shadow-lg backdrop-blur-sm dark:border-orange-800/50 dark:bg-zinc-900/80"
            layout
          >
            {/* Content Header */}
            <div className="flex items-center justify-between border-b border-orange-200/50 px-6 py-4 dark:border-orange-800/50">
              <div className="flex items-center gap-3">
                <activeTabData.icon className="size-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <h2 className="font-semibold text-orange-900 dark:text-orange-50">
                    {activeTabData.label}
                  </h2>
                  <p className="text-sm text-orange-700/60 dark:text-orange-300/60">
                    {activeTabData.description}
                  </p>
                </div>
              </div>

              {showEditButton && (
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex gap-2"
                      exit={{ opacity: 0, scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      key="editing"
                    >
                      <Button
                        className="border-orange-200 text-orange-800 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-200 dark:hover:bg-orange-900/30"
                        disabled={isSaving}
                        onClick={handleCancel}
                        size="sm"
                        variant="outline"
                      >
                        <X className="mr-1 size-4" />
                        Cancel
                      </Button>
                      <Button
                        className="bg-orange-600 text-white hover:bg-orange-700"
                        disabled={isSaving}
                        onClick={handleSave}
                        size="sm"
                      >
                        {isSaving ? (
                          <Loader2 className="mr-1 size-4 animate-spin" />
                        ) : (
                          <Check className="mr-1 size-4" />
                        )}
                        Save
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      key="viewing"
                    >
                      <Button
                        className="border-orange-200 text-orange-800 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-200 dark:hover:bg-orange-900/30"
                        onClick={() => setIsEditing(true)}
                        size="sm"
                        variant="outline"
                      >
                        <Pencil className="mr-1 size-4" />
                        Edit
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  animate="animate"
                  exit="exit"
                  initial="initial"
                  key={activeTab}
                  transition={{ duration: 0.2 }}
                  variants={fadeInUp}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}

// Field Section Component
function FieldSection({
  label,
  description,
  icon: Icon,
  name,
  value,
  placeholder,
  type,
  isEditing,
  onChange,
}: {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  value: string;
  placeholder: string;
  type: "input" | "textarea";
  isEditing: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}) {
  return (
    <motion.div
      className="rounded-lg border border-orange-100 bg-orange-50/30 p-4 dark:border-orange-900/30 dark:bg-orange-950/20"
      layout
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon className="size-4 text-orange-600 dark:text-orange-400" />
        <span className="font-medium text-orange-900 dark:text-orange-100">
          {label}
        </span>
      </div>
      <p className="mb-3 text-sm text-orange-700/60 dark:text-orange-300/60">
        {description}
      </p>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
            key="edit"
          >
            {type === "input" ? (
              <Input
                className="border-orange-200 bg-white focus:border-orange-400 focus:ring-orange-400 dark:border-orange-800 dark:bg-zinc-800"
                name={name}
                onChange={onChange}
                placeholder={placeholder}
                value={value}
              />
            ) : (
              <Textarea
                className="min-h-[100px] resize-none border-orange-200 bg-white focus:border-orange-400 focus:ring-orange-400 dark:border-orange-800 dark:bg-zinc-800"
                name={name}
                onChange={onChange}
                placeholder={placeholder}
                value={value}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="view"
          >
            {value ? (
              <p className="whitespace-pre-wrap text-orange-900 dark:text-orange-100">
                {value}
              </p>
            ) : (
              <p className="italic text-orange-500/50 dark:text-orange-400/50">
                Not set yet
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
