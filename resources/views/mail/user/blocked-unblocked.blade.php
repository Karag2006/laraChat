<x-mail::message>
Hello {{$user->name}},

@if ($user->blocked_at)
Your Account has been suspended. You are no longer able to Log In.
@else
Your Account has been reactivated. You can now use the System normally again.
<x-mail::button url="{{route('login')}}">
Click here to Log In
</x-mail::button>
@endif

Thank you, <br>
{{config('app.name')}}
</x-mail::message>
