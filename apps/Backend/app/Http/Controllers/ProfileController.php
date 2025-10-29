<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class ProfileController extends Controller
{
    // ดึงข้อมูลโปรไฟล์ของ user ที่ล็อกอิน
    public function show(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    // อัปเดตข้อมูลโปรไฟล์
    public function update(Request $request)
    {
        $user = $request->user();

        // ตรวจสอบความถูกต้องของข้อมูลที่ส่งมา
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'birthday' => 'nullable|date',
            'profilepic' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // ถ้ามีการอัปโหลดรูปใหม่
        if ($request->hasFile('profilepic')) {
            // ถ้ามีรูปเก่าอยู่ ลบออกก่อน
            if ($user->profilepic && Storage::disk('public')->exists($user->profilepic)) {
                Storage::disk('public')->delete($user->profilepic);
            }

            // บันทึกรูปใหม่ในโฟลเดอร์ storage/app/public/products
            $path = $request->file('profilepic')->store('profile_pics', 'public');
            $validated['profilepic'] = $path;
        }

        // อัปเดตข้อมูลใน database
        $user->update($validated);

        // ส่งข้อมูลกลับเป็น JSON
        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user
        ]);
    }
}
