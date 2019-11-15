package com.sample61;

import android.view.View;
import android.widget.TextView;

import org.hamcrest.Matcher;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import androidx.test.espresso.DataInteraction;
import androidx.test.espresso.Root;
import androidx.test.espresso.UiController;
import androidx.test.espresso.ViewAction;
import androidx.test.rule.ActivityTestRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.clearText;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.RootMatchers.isDialog;
import static androidx.test.espresso.matcher.ViewMatchers.isAssignableFrom;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withContentDescription;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.endsWith;
import static org.hamcrest.CoreMatchers.not;

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

    public String getText(final Matcher<View> matcher) {
        final String[] stringHolder = { null };
        onView(matcher).perform(new ViewAction() {
            @Override
            public Matcher<View> getConstraints() {
                return isAssignableFrom(TextView.class);
            }

            @Override
            public String getDescription() {
                return "getting text from a TextView";
            }

            @Override
            public void perform(UiController uiController, View view) {
                TextView tv = (TextView)view;
                stringHolder[0] = tv.getText().toString();
            }
        });
        return stringHolder[0];
    }

    @Test
    public void canShowInteraction() {
        onView(withContentDescription("input-event-name"))
                .perform(clearText())
                .perform(typeText("test"));

        onView(withContentDescription("button-can-show-interaction"))
                .check(matches(isDisplayed()))
                .perform(click());

        onView(withId(android.R.id.message))
                .inRoot(isDialog())
                .check(matches(withText(endsWith("true"))));

        onView(withId(android.R.id.button1))
                .inRoot(isDialog())
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