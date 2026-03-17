import React from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../common/Input';
import { getCardType } from '../../utils/validators';
import { formatCardNumber } from '../../utils/formatters';

const CardInputForm = ({ cardNumber, expiry, cvv, name, onUpdate, errors = {} }) => {
  return (
    <View style={styles.container}>
      <Input
        label="Card Number"
        value={formatCardNumber(cardNumber || '')}
        onChangeText={(t) => onUpdate?.('cardNumber', t.replace(/\s/g, ''))}
        placeholder="1234 5678 9012 3456"
        keyboardType="numeric"
        maxLength={19}
        error={errors.cardNumber}
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <Input
            label="Expiry"
            value={expiry || ''}
            onChangeText={(t) => onUpdate?.('expiry', t)}
            placeholder="MM/YY"
            keyboardType="numeric"
            maxLength={5}
            error={errors.expiry}
          />
        </View>
        <View style={styles.half}>
          <Input
            label="CVV"
            value={cvv || ''}
            onChangeText={(t) => onUpdate?.('cvv', t)}
            placeholder="123"
            keyboardType="numeric"
            maxLength={4}
            variant="password"
            error={errors.cvv}
          />
        </View>
      </View>
      <Input
        label="Cardholder Name"
        value={name || ''}
        onChangeText={(t) => onUpdate?.('name', t)}
        placeholder="John Doe"
        autoCapitalize="words"
        error={errors.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
});

export default CardInputForm;
