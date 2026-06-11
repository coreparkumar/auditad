package com.auditad.app;

import android.content.Context;
import android.content.pm.PackageManager;
import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AppCheck")
public class AppCheckPlugin extends Plugin {

    @PluginMethod
    public void isAppInstalled(PluginCall call) {
        String packageName = call.getString("packageName");
        if (packageName == null) {
            call.reject("Package name is required");
            return;
        }

        boolean installed = isAppReallyInstalled(packageName, getContext());
        JSObject ret = new JSObject();
        ret.put("installed", installed);
        call.resolve(ret);
    }

    @PluginMethod
    public void openAppSettings(PluginCall call) {
        String packageName = call.getString("packageName");
        if (packageName == null) {
            call.reject("Package name is required");
            return;
        }

        try {
            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            Uri uri = Uri.fromParts("package", packageName, null);
            intent.setData(uri);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Could not open app settings: " + e.getMessage());
        }
    }

    @PluginMethod
    public void openPrivateDnsSettings(PluginCall call) {
        try {
            Intent intent = new Intent("android.settings.VPN_SETTINGS"); // Fallback for VPN/DNS area
            // On Android 9+, this is more specific:
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {
                intent = new Intent(Settings.ACTION_WIRELESS_SETTINGS);
            }
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Could not open DNS settings: " + e.getMessage());
        }
    }

    private boolean isAppReallyInstalled(String packageName, Context context) {
        try {
            // MATCH_DEFAULT_ONLY ensures we don't accidentally pull ghost metadata
            PackageManager pm = context.getPackageManager();
            pm.getPackageInfo(packageName, PackageManager.MATCH_DEFAULT_ONLY);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            // The OS kernel guarantees the app is completely dead
            return false;
        } catch (SecurityException e) {
            // App exists but is walled off inside a secure workspace container
            return true;
        }
    }
}
