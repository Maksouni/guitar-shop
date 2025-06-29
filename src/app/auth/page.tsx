"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;
  password: string;
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (result?.error) {
          if (result.status === 401) {
            setError("Неверный email или пароль");
          } else {
            setError("Ошибка входа. Попробуйте снова.");
          }
        } else {
          router.push("/");
        }
      } else {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 409) {
            throw new Error("Пользователь с таким email уже существует");
          }
          throw new Error(errorData.message || "Ошибка регистрации");
        }

        await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          {isLogin ? "Вход в аккаунт" : "Создание аккаунта"}
        </h2>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "Email обязателен",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Некорректный email",
                },
              })}
              className={`w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              id="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              {...register("password", {
                required: "Пароль обязателен",
                minLength: {
                  value: 6,
                  message: "Минимальная длина — 6 символов",
                },
              })}
              className={`w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Пароль"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition disabled:opacity-50"
          >
            {loading
              ? isLogin
                ? "Входим..."
                : "Регистрируем..."
              : isLogin
              ? "Войти"
              : "Зарегистрироваться"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setError("");
              setIsLogin(!isLogin);
            }}
            className="text-sm text-indigo-600 hover:text-indigo-500 transition"
          >
            {isLogin
              ? "Нет аккаунта? Зарегистрироваться"
              : "Есть аккаунт? Войти"}
          </button>
        </div>
      </div>
    </div>
  );
}
