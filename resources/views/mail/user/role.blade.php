<x-mail::message>
Hello {{$user->name}},

@if ($user->is_admin)
Your are now an Admin in the System. You can add and block users.
@else
Your Account was changed into a regular User.
@endif
<br>

<x-mail::button url="{{route('login')}}">
Click here to Log In
</x-mail::button>

Thank you, <br>
{{config('app.name')}}
</x-mail::message>
