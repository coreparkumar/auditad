package com.auditad.app.vercel.janitor

import android.content.Intent
import com.getcapacitor.Plugin
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "Janitor")
class JanitorPlugin : Plugin() {

    @PluginMethod
    fun openJanitorWorkspace(call: com.getcapacitor.PluginCall) {
        val intent = Intent(context, JanitorActivity::class.java)
        context.startActivity(intent)
        call.resolve()
    }
}
