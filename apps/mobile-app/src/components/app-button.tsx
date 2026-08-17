import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from 'react-native'

import { Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

type AppButtonProps = PressableProps & {
  label: string
  loading?: boolean
  variant?: 'primary' | 'secondary'
}

export function AppButton({ label, loading = false, variant = 'primary', disabled, ...rest }: AppButtonProps) {
  const theme = useTheme()
  const isSecondary = variant === 'secondary'

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isSecondary ? theme.backgroundSelected : '#3c87f7',
          opacity: pressed || (disabled ?? false) ? 0.7 : 1,
        },
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? theme.text : '#ffffff'} />
      ) : (
        <Text style={[styles.label, { color: isSecondary ? theme.text : '#ffffff' }]}>{label}</Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
})
