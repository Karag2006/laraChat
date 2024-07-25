<x-mail::message>
Hello {{$user->name}},

You account has been created successfully.

**Here is you login information:**  <br>
Email: {{$user->email}} <br>
Password: {{$password}} <br>

Please login to the system and change your password.

<x-mail::button url="{{route('login')}}">
Click here to Log In
</x-mail::button>

Thank you, <br>
{{config('app.name')}}
</x-mail::message>
