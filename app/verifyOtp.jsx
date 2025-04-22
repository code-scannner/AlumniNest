import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Button from "@/components/Button";
import { router } from "expo-router";

const VerifyOtp = () => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(30);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft > 0) {
      const interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [secondsLeft]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      Alert.alert("Verification", "Please enter the 6-digit OTP");
      return;
    }

    Alert.alert("Verified", "Your email has been verified successfully!");
    router.push("/(main)/home");
  };

  const handleResendOtp = () => {
    if (secondsLeft === 0) {
      Alert.alert("Resend OTP", "OTP resent!");
      setSecondsLeft(30); // Restart the timer
      // Trigger resend OTP API here if needed
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* <BackButton /> */}

        <View>
          <Text style={styles.welcomeText}>Email Verification</Text>
          <Text style={styles.subText}>
            Enter the 6-digit code sent to your mail
          </Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              value={digit}
              onChangeText={(text) =>
                handleChange(text.replace(/[^0-9]/g, ""), index)
              }
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              style={[
                styles.otpInput,
                digit && { borderColor: theme.colors.primaryDark }
              ]}
          />
          ))}
        </View>

        <Button title="Verify" onPress={handleVerify} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Didn't receive the code?</Text>
          {secondsLeft === 0 ? (
            <Pressable onPress={handleResendOtp}>
              <Text style={[styles.footerText, styles.resendText]}>
                Resend
              </Text>
            </Pressable>
          ) : (
            <Text style={[styles.footerText, styles.resendText]}>
              Resend in {secondsLeft}s
            </Text>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    // alignItems: "center",
    // justifyContent: "center",
    paddingHorizontal: wp(5),
    marginTop: 100,
  },
  welcomeText: {
    fontSize: hp(3.5),
    fontWeight: "bold",
    color: theme.colors.text,
  },
  subText: {
    fontSize: hp(1.8),
    color: theme.colors.textLight,
    marginTop: 5,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(2),
    marginBottom: hp(4),
  },
  otpInput: {
    width: wp(12),
    height: wp(14),
    fontSize: hp(2.5),
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.grayLight,
    textAlign: "center",
    color: theme.colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
  resendText: {
    color: theme.colors.primaryDark,
    fontWeight: "700",
  },
});
