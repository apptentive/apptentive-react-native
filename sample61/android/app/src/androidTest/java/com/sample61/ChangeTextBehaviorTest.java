package com.sample61;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import androidx.test.rule.ActivityTestRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

@RunWith(AndroidJUnit4.class)
public class ChangeTextBehaviorTest {
    @Rule
    public ActivityTestRule<MainActivity> activityRule
            = new ActivityTestRule<>(MainActivity.class);

    @Before
    public void initValidString() {
//        TODO: Replace with idler
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void engage() {
        onView(withText("ENGAGE"))
                .perform(click());

    }

//    @Test
//    public void messageCenter() {
//        onView(withText("MESSAGE CENTER"))
//                .perform(click());
//
//    }
//
//    @Test
//    public void interaction() {
//        onView(withText("CAN SHOW INTERACTION?"))
//                .perform(click());
//    }
//
//    @Test
//    public void deviceData() {
//        onView(withText("DEVICE DATA"))
//                .perform(click());
//    }
//
//    @Test
//    public void personData() {
//        onView(withText("PERSON DATA"))
//                .perform(click());
//    }
}