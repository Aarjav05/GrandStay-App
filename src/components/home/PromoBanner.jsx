import React, { useRef, useEffect, useState } from 'react';
import { View, Image, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { BORDER_RADIUS, SPACING } from '../../utils/constants';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - SPACING.lg * 2;

const PROMOS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600', title: '40% OFF Luxury' },
  { id: '2', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600', title: 'Beach Getaway' },
  { id: '3', image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600', title: 'Weekend Deals' },
];

const PromoBanner = ({ promos = PROMOS, style }) => {
  const { colors } = useTheme();
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % promos.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, promos.length]);

  return (
    <View style={[styles.container, style]}>
      <FlatList
        ref={flatListRef}
        data={promos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.banner, { width: BANNER_WIDTH }]}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
          </View>
        )}
      />
      <View style={styles.dots}>
        {promos.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === activeIndex ? colors.primary : colors.border,
                width: index === activeIndex ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: SPACING.md },
  banner: { marginHorizontal: SPACING.lg, borderRadius: BORDER_RADIUS.lg, overflow: 'hidden' },
  image: { width: '100%', height: 160, borderRadius: BORDER_RADIUS.lg },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.sm },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 3 },
});

export default PromoBanner;
