export const gradients = {
  primary: "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600",
  secondary: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
  success: "bg-gradient-to-r from-green-400 to-blue-500",
  warning: "bg-gradient-to-r from-yellow-400 to-orange-500",
  danger: "bg-gradient-to-r from-red-500 to-pink-500",
  info: "bg-gradient-to-r from-cyan-400 to-blue-500",
  dark: "bg-gradient-to-r from-gray-800 via-gray-900 to-black",
  rainbow: "bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500",
};

export const glowEffects = {
  blue: "shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
  purple: "shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40",
  pink: "shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40",
  green: "shadow-lg shadow-green-500/25 hover:shadow-green-500/40",
  orange: "shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40",
  red: "shadow-lg shadow-red-500/25 hover:shadow-red-500/40",
};

export const getRandomGradient = () => {
  const gradientKeys = Object.keys(gradients);
  const randomKey =
    gradientKeys[Math.floor(Math.random() * gradientKeys.length)];
  return gradients[randomKey as keyof typeof gradients];
};

export const getRandomGlow = () => {
  const glowKeys = Object.keys(glowEffects);
  const randomKey = glowKeys[Math.floor(Math.random() * glowKeys.length)];
  return glowEffects[randomKey as keyof typeof glowEffects];
};
