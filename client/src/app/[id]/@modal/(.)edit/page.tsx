"use client"
import { useEffect, useState } from 'react';
import { X, Camera } from 'lucide-react';
import { Image as ImageIcon } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useGetCurrentUser, useUpdateUser } from '../../../../Hooks/user';
import { getPresignUrlQuery } from '../../../../graphql/query/tweet';
import { graphQLClient } from '../../../../client/api';
import { uploadImageToCloudinary } from '../../../../Hooks/useCloudinaryUpload';

export default function Edit() {
  const [name, setName] = useState('Mahir Mankad');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('India');
  const [profileImage, setProfileImage] = useState('https://pbs.twimg.com/profile_images/1746521234567890/yourimage.jpg'); 
  const [coverImage, setCoverImage] = useState('https://pbs.twimg.com/profile_banners/1234567890/1700000000/1500x500'); 
  
  // Store actual File objects for upload
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const { mutateAsync } = useUpdateUser();

  const { data: currentUser } = useGetCurrentUser();

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";

    return () => {
      // Unlock when modal closes
      document.body.style.overflow = "auto";
    };
  }, []);


  const handleUploadToCloudinary = async (files: File[]): Promise<string[]> => {
    try {
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET || 'supa@me';
      if (!uploadPreset) throw new Error('Cloudinary unsigned upload preset missing');
      const urls: string[] = [];
      for (const file of files) {
        const data = await graphQLClient.request(getPresignUrlQuery, {
          imageType: file.type,
          imageName: file.name
        });
        const uploadUrl = data.getPresignUrl;
        const imageUrl = await uploadImageToCloudinary(file, uploadUrl, uploadPreset);
        if (!imageUrl) throw new Error('Cloudinary upload failed');
        urls.push(imageUrl);
      }
      return urls;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const handleUpdateUserData = async () => {
    try {
      const updatedData: { firstName?: string; lastName?: string; profileImage?: string; coverImage?: string, bio?: string, location?: string } = {};
      const nameParts = name.trim().split(' ');
      if (nameParts.length > 0) {
        updatedData.firstName = nameParts[0];
        updatedData.lastName = nameParts.slice(1).join(' ') || undefined;
      }
      
      // Only upload if a new file was selected
      if (profileImageFile) {
        const urls = await handleUploadToCloudinary([profileImageFile]);
        updatedData.profileImage = urls[0];
      }
      if (coverImageFile) {
        const urls = await handleUploadToCloudinary([coverImageFile]);
        updatedData.coverImage = urls[0];
      }
      if (bio) updatedData.bio = bio;
      if (location) updatedData.location = location;

      await mutateAsync(updatedData).then(() => {
        router.back();
      });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.getCurrentUser) {
      const user = currentUser.getCurrentUser;
      setName(`${user.firstName} ${user.lastName || ''}`);
      setProfileImage(user.profileImage || profileImage);
      setCoverImage(user.coverImage || coverImage);
      setBio(user.bio || '');
      setLocation(user.location || '');
    }
  }, [currentUser]);

  const router = useRouter();


  // Dummy handler for photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file); // Store the actual file for upload
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImage(ev.target?.result as string); // Preview only
      };
      reader.readAsDataURL(file);
    }
  };

  // Dummy handler for cover upload
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file); // Store the actual file for upload
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCoverImage(ev.target?.result as string); // Preview only
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="relative w-full max-w-lg mx-auto bg-[#16181c] rounded-2xl shadow-2xl border border-gray-700 overflow-hidden pointer-events-auto">
        <button className="absolute top-4 left-4 p-2 z-50 rounded-full hover:bg-gray-800 transition-colors" aria-label="Close" onClick={() => router.back()}>
          <X />
        </button>
        {/* Save Button */}
        <button 
        className="absolute top-4 right-4 px-5 py-2 z-50 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors bg-slate-500 opacity-30 rounded-full"
        onClick={handleUpdateUserData}>
          Save
        </button>
        {/* Close Button */}
        {/* Cover Image Section */}
        <div className="relative w-full h-40 bg-gray-800">
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <label htmlFor="cover-photo-upload" className="absolute bottom-2 right-4 bg-black bg-opacity-60 rounded-full p-2 cursor-pointer hover:bg-opacity-90 transition-colors flex items-center">
            <ImageIcon className="w-5 h-5 text-white" />
            <input
              id="cover-photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </label>
          {/* Profile Image Overlapping Cover (bottom left) */}
          <div className="absolute left-8 -bottom-14">
            <div className="relative">
              <img
                src={profileImage}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-black object-cover bg-gray-700"
              />
              <label htmlFor="profile-photo-upload" className="absolute bottom-2 right-2 bg-black bg-opacity-70 rounded-full p-2 cursor-pointer hover:bg-opacity-90 transition-colors flex items-center">
                <Camera className="w-5 h-5 text-white" />
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
          </div>
        </div>
        {/* Modal Content Below Cover/Profile */}
        <div className="flex flex-col px-8 pt-20 pb-8">
          <h2 className="text-2xl font-bold text-white mb-6 mt-2 self-center">Edit profile</h2>
          {/* Edit your photo with Imagine section */}
          <div className="flex items-center justify-between bg-[#23272f] rounded-xl px-4 py-3 mb-6">
            <div>
              <div className="text-white font-semibold text-base">Edit your photo with Imagine</div>
              <div className="text-gray-400 text-xs">Customize yourself in seconds</div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#23272f] border border-gray-600 rounded-full text-white font-semibold hover:bg-[#222] transition-colors">
              <Camera className="w-4 h-4" /> Edit Photo
            </button>
          </div>
          {/* Name Input */}
          <div className="w-full mb-4">
            <label className="block text-gray-400 text-sm mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              className="w-full px-4 py-2 rounded-lg bg-[#23272f] text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={50}
            />
          </div>
          {/* Bio Input */}
          <div className="w-full mb-4">
            <label className="block text-gray-400 text-sm mb-1" htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              className="w-full px-4 py-2 rounded-lg bg-[#23272f] text-white border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              maxLength={160}
            />
          </div>
          {/* Location Input */}
          <div className="w-full mb-2">
            <label className="block text-gray-400 text-sm mb-1" htmlFor="location">Location</label>
            <input
              id="location"
              className="w-full px-4 py-2 rounded-lg bg-[#23272f] text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              value={location}
              onChange={e => setLocation(e.target.value)}
              maxLength={30}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
