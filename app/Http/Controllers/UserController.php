<?php

namespace App\Http\Controllers;

use App\Mail\UserBlockStatusChanged;
use App\Mail\UserCreated;
use App\Mail\UserRoleChanged;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => ['required', 'email', 'unique:users,email'],
            'is_admin' => 'boolean',
        ]);
        // Generate and assign a random password
        $rawPassword = Str::random(8);
        // $rawPassword = '12345678';
        $data['password'] = bcrypt($rawPassword);
        $data['email_verified_at'] = now();

        $user = User::create($data);

        Mail::to($user)->send(new UserCreated($user, $rawPassword));

        return redirect()->back();
    }

    public function changeRole(User $user) {
        $user->update(['is_admin' => !(bool) $user->is_admin]);

        $message = "User role was changed to: " . ($user->is_admin ? '"Admin"' : '"Regular User"');

        Mail::to($user)->send(new UserRoleChanged($user));

        return response()->json(['message' => $message]);
    }

    public function toggleBlock(User $user) {
        if($user->blocked_at) {
            $user->blocked_at = null;
            $message = "User '".$user->name."' has been activated";
        } else {
            $user->blocked_at = now();
            $message = "User '".$user->name."' has been blocked";
        }

        $user->save();

        Mail::to($user)->send(new UserBlockStatusChanged($user));

        return response()->json(['message' => $message]);
    }
}
