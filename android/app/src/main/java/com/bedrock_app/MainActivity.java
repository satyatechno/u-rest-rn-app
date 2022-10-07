package com.bedrock_app;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;


public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
        // SplashScreen.show(this, R.style.SplashScreenTheme);  // here
      SplashScreen.show(this, R.style.SplashScreenTheme); 
        super.onCreate(null);
    }
  protected String getMainComponentName() {
    return "bedrock_app";
  }
}
