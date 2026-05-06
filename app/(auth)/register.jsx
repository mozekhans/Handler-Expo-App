// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { useRouter } from 'expo-router';

const RegisterScreen = ({ navigation }) => {
  const { register, loginWithGoogle, loginWithFacebook } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();



  const { values, handleChange, handleSubmit, isSubmitting, errors, setFieldValue } = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      company: '',
      jobTitle: '',
      industry: '',
      phone: '',
      marketingEmails: false,
    },
    validate: (formValues) => {
      const errors = {};
      
      if (activeStep === 0) {
        if (!formValues.email) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
          errors.email = 'Email is invalid';
        }
        
        if (!formValues.password) {
          errors.password = 'Password is required';
        } else if (formValues.password.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formValues.password)) {
          errors.password = 'Password must contain at least one letter and one number';
        }
        
        if (formValues.password !== formValues.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
      } else if (activeStep === 1) {
        if (!formValues.firstName) {
          errors.firstName = 'First name is required';
        }
        if (!formValues.lastName) {
          errors.lastName = 'Last name is required';
        }
      }
      
      return errors;
    },
    onSubmit: async (formValues) => {
      const result = await register({
        email: formValues.email,
        password: formValues.password,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        company: formValues.company,
        jobTitle: formValues.jobTitle,
        industry: formValues.industry,
        phone: formValues.phone,
        preferences: {
          marketingEmails: formValues.marketingEmails,
        },
      });
      
      if (result.success) {
        router.push('/verify-email', { email: formValues.email });
      } else {
        Alert.alert('Registration Failed', result.error || 'Failed to register');
      }
    },
  });

  const validateCurrentStep = () => {
    if (activeStep === 0) {
      const stepValid = values.email && values.password && values.confirmPassword &&
        values.password === values.confirmPassword &&
        values.password.length >= 8;
      return stepValid;
    } else if (activeStep === 1) {
      return values.firstName && values.lastName;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep(prev => prev + 1);
    } else {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSocialLogin = async (provider) => {
    let result;
    if (provider === 'google') {
      result = await loginWithGoogle();
    } else if (provider === 'facebook') {
      result = await loginWithFacebook();
    }
    
    if (!result?.success) {
      Alert.alert('Login Failed', result?.error || `Failed to login with ${provider}`);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={values.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                value={values.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Confirm Password"
                value={values.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </>
        );

      case 1:
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={values.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
            />
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={values.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
            />
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Company (Optional)"
              value={values.company}
              onChangeText={(text) => handleChange('company', text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Job Title (Optional)"
              value={values.jobTitle}
              onChangeText={(text) => handleChange('jobTitle', text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Industry (Optional)"
              value={values.industry}
              onChangeText={(text) => handleChange('industry', text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number (Optional)"
              value={values.phone}
              onChangeText={(text) => handleChange('phone', text)}
              keyboardType="phone-pad"
            />
          </>
        );

      case 2:
        return (
          <View>
            <Text style={styles.sectionTitle}>Almost there!</Text>
            <Text style={styles.sectionSubtitle}>
              Choose your preferences to get started. You can always change these later.
            </Text>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleChange('marketingEmails', !values.marketingEmails)}
            >
              <View style={[styles.checkbox, values.marketingEmails && styles.checkboxChecked]}>
                {values.marketingEmails && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                Send me marketing emails with tips and updates
              </Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.linkText}>Terms of Service</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Your Account</Text>

          {/* Step Indicator */}
          <View style={styles.stepsContainer}>
            {['Account', 'Profile', 'Preferences'].map((label, index) => (
              <View key={label} style={styles.stepContainer}>
                <View
                  style={[
                    styles.stepCircle,
                    index <= activeStep && styles.stepCircleActive,
                    index === activeStep && styles.stepCircleCurrent,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepText,
                      index <= activeStep && styles.stepTextActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                {index < 2 && (
                  <View
                    style={[
                      styles.stepLine,
                      index < activeStep && styles.stepLineActive,
                    ]}
                  />
                )}
                <Text style={styles.stepLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {renderStepContent()}

          <View style={styles.navigationButtons}>
            {activeStep > 0 && (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            
            {activeStep < 2 ? (
              <TouchableOpacity
                style={[styles.nextButton, !validateCurrentStep() && styles.disabledButton]}
                onPress={handleNext}
                disabled={!validateCurrentStep()}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('google')}
            >
              <Text style={styles.socialButtonText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('facebook')}
            >
              <Text style={styles.socialButtonText}>f</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#1976d2',
  },
  stepCircleCurrent: {
    borderWidth: 2,
    borderColor: '#1976d2',
  },
  stepText: {
    color: '#666',
    fontWeight: '600',
  },
  stepTextActive: {
    color: '#fff',
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: -16,
    height: 2,
    backgroundColor: '#ddd',
    zIndex: -1,
  },
  stepLineActive: {
    backgroundColor: '#1976d2',
  },
  stepLabel: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    marginBottom: 0,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -8,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginRight: 8,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  linkText: {
    color: '#1976d2',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#666',
  },
  footerLink: {
    color: '#1976d2',
    fontWeight: '600',
  },
});

export default RegisterScreen;