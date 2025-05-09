import React from 'react';
import { StyleSheet } from 'react-native';
import Video from 'react-native-video';

const VideoBackground = () => {
  return (
    <Video
      source={require('../../assets/videos/background.mp4')}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
      repeat
      muted
      playWhenInactive={false}
      playInBackground={false}
      ignoreSilentSwitch="obey"
    />
  );
};

export default VideoBackground;
