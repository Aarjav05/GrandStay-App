import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useTheme } from '../../hooks/useTheme';
import { SPACING } from '../../utils/constants';

const PromoCodeInput = ({ onApply, appliedCode, style }) => {
  const { colors } = useTheme();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleApply = () => {
    if (!code.trim()) {
      setError('Please enter a promo code');
      return;
    }
    setError('');
    onApply?.(code.trim().toUpperCase());
  };

  return (
    <View style={style}>
      {appliedCode ? (
        <Badge label={`${appliedCode} applied ✓`} variant="success" size="md" />
      ) : (
        <View style={styles.row}>
          <View style={styles.inputWrapper}>
            <Input
              value={code}
              onChangeText={(t) => { setCode(t); setError(''); }}
              placeholder="Enter promo code"
              autoCapitalize="characters"
              error={error}
              style={{ marginBottom: 0 }}
            />
          </View>
          <Button title="Apply" onPress={handleApply} size="sm" fullWidth={false} style={styles.btn} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  inputWrapper: { flex: 1, marginRight: SPACING.sm },
  btn: { marginTop: 0, paddingVertical: 14 },
});

export default PromoCodeInput;
