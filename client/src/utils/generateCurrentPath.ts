const apiPort = import.meta.env.VITE_API_PORT;

export function generateCurrentPath(profileImage: string | File | null | undefined): string {
  if (!profileImage) {
    return '/images/Default_User.jpg';
  }
  if (typeof profileImage === 'string') {
    return `${apiPort}${profileImage}`;
  }

  if (profileImage instanceof File) {
    return URL.createObjectURL(profileImage);
  }
  return '/images/Default_User.jpg';
}
