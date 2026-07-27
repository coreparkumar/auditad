package com.auditad.app;

import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.provider.Settings;
import androidx.core.content.pm.PackageInfoCompat; // Added for backwards-compatible version code evaluation
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.List;

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
            Intent intent = new Intent("android.settings.VPN_SETTINGS"); 
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

    @PluginMethod
    public void requestScanPermission(PluginCall call) {
        JSObject ret = new JSObject();

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
            try {
                Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                Uri uri = Uri.fromParts("package", getContext().getPackageName(), null);
                intent.setData(uri);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(intent);

                ret.put("granted", false);
                ret.put("needsSettings", true);
                ret.put("explanation", "Android 11+ needs package visibility access for a full phone scan. Enable the permission in Settings, then tap Scan This Phone again.");
                call.resolve(ret);
            } catch (Exception e) {
                call.reject("Could not open Android permission settings: " + e.getMessage());
            }
            return;
        }

        ret.put("granted", true);
        ret.put("needsSettings", false);
        call.resolve(ret);
    }

    @PluginMethod
    public void getInstalledApps(PluginCall call) {
        try {
            Context context = getContext();
            PackageManager pm = context.getPackageManager();
            
            // Modern API 33+ safe check for package fetching
            List<ApplicationInfo> apps;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                apps = pm.getInstalledApplications(PackageManager.ApplicationInfoFlags.of(PackageManager.MATCH_DEFAULT_ONLY));
            } else {
                apps = pm.getInstalledApplications(PackageManager.MATCH_DEFAULT_ONLY);
            }

            JSArray items = new JSArray();

            for (ApplicationInfo appInfo : apps) {
                try {
                    PackageInfo packageInfo;
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                        packageInfo = pm.getPackageInfo(appInfo.packageName, PackageManager.PackageInfoFlags.of(0));
                    } else {
                        packageInfo = pm.getPackageInfo(appInfo.packageName, 0);
                    }

                    // Use AndroidX PackageInfoCompat to safely fetch long version codes without deprecation warnings
                    long longVersionCode = PackageInfoCompat.getLongVersionCode(packageInfo);

                    JSObject item = new JSObject();
                    item.put("name", pm.getApplicationLabel(appInfo).toString());
                    item.put("packageName", appInfo.packageName);
                    item.put("versionName", packageInfo.versionName != null ? packageInfo.versionName : "");
                    item.put("versionCode", longVersionCode); // Replaced old field accessor
                    item.put("targetSdk", appInfo.targetSdkVersion);
                    item.put("isSystemApp", (appInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0);
                    items.put(item);
                } catch (PackageManager.NameNotFoundException ignored) {
                    // Skip broken entries.
                }
            }

            JSObject ret = new JSObject();
            ret.put("apps", items);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Could not scan installed applications: " + e.getMessage());
        }
    }

    private boolean isAppReallyInstalled(String packageName, Context context) {
        try {
            PackageManager pm = context.getPackageManager();
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                pm.getPackageInfo(packageName, PackageManager.PackageInfoFlags.of(PackageManager.MATCH_DEFAULT_ONLY));
            } else {
                pm.getPackageInfo(packageName, PackageManager.MATCH_DEFAULT_ONLY);
            }
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        } catch (SecurityException e) {
            return true;
        }
    }
}