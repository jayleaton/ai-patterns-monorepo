import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Link } from 'expo-router'

import { AppButton } from '@/components/app-button'
import { AppTextInput } from '@/components/app-text-input'
import { Screen } from '@/components/screen'
import { ThemedText } from '@/components/themed-text'
import { Spacing } from '@/constants/theme'
import { signIn } from '@/lib/auth/authClient'
import { signInSchema } from '@/lib/validators/authSchemas'
import { getFieldErrors } from '@/lib/validators/formErrors'

export default function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const parsed = signInSchema.safeParse({ email, password })
    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error))
      return
    }

    setErrors({})
    setFormError(null)
    setLoading(true)
    const { error } = await signIn.email(parsed.data)
    setLoading(false)

    if (error) {
      setFormError(error.message ?? 'Could not sign in')
      return
    }
    // Signed in — the (auth) layout redirect handles navigation.
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText type="title">Sign in</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Use your Better Stack account.
          </ThemedText>

          <View style={styles.form}>
            <AppTextInput
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />
            <AppTextInput
              label="Password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="current-password"
              textContentType="password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />

            {formError ? <ThemedText style={styles.formError}>{formError}</ThemedText> : null}

            <AppButton label="Sign in" loading={loading} onPress={handleSubmit} />
          </View>

          <View style={styles.footer}>
            <ThemedText themeColor="textSecondary">No account yet? </ThemedText>
            <Link href="/sign-up" asChild>
              <Pressable hitSlop={Spacing.two}>
                <ThemedText type="linkPrimary">Create one</ThemedText>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: Spacing.four,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  subtitle: {
    marginBottom: Spacing.three,
  },
  form: {
    gap: Spacing.three,
  },
  formError: {
    color: '#e5484d',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.four,
  },
})
