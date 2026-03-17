import React, { useState, useRef } from 'react';
import { View, Image, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { BORDER_RADIUS } from '../../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ImageCarousel = ({ images = [], height = 250, style }) => {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const defaultImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
  ];
  const displayImages = images.length > 0 ? images : defaultImages;

  return (
    <View style={[styles.container, { height }, style]}>
      <FlatList
        data={displayImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={[styles.image, { height }]}
            resizeMode="cover"
          />
        )}
      />
      {displayImages.length > 1 && (
        <View style={styles.pagination}>
          {displayImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === activeIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                  width: index === activeIndex ? 20 : 8,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: SCREEN_WIDTH,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});

export default ImageCarousel;
