const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("sql");

const withNativeWindConfig = withNativeWind(config, { input: "./global.css" });

module.exports = withNativeWindConfig;
