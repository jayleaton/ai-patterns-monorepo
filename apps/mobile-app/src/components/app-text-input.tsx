import { StyleSheet, Text, TextInput, type TextInputProps } from 'react-native'

import { Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

type AppTextInputProps = TextInputProps & {
  label?: string
  error?: string | null
}

export function AppTextInput({ label, error, style, ...rest }: AppTextInputProps) {
  const theme = useTheme()

  return (
    <>
      {label ? <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text> : null}
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          { backgroundColor: theme.backgroundElement, color: theme.text, borderColor: error ? '#e5484d' : 'transparent' },
          style,
        ]}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.half,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    height: 48,
    paddingHorizontal: Spacing.three,
  },
  error: {
    color: '#e5484d',
    fontSize: 13,
    marginTop: Spacing.half,
  },
})
