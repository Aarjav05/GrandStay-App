import React from 'react';
import { View, Modal as RNModal, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { BORDER_RADIUS } from '../../utils/constants';

const Modal = ({ visible, onClose, children, style }) => {
  const { colors } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.content, { backgroundColor: colors.card }, style]}>
              <View style={[styles.handle, { backgroundColor: colors.border }]} />
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingHorizontal: 20,
    paddingBottom: 34,
    maxHeight: Dimensions.get('window').height * 0.85,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },
});

export default Modal;
