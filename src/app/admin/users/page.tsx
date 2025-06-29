"use client";
import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  role_id: number;
};

export default function UsersAdminClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState(0);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const createUser = async () => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          role_id: newRole + 1,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Ошибка создания");
      }
      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
      setNewEmail("");
      setNewPassword("");
      setNewRole(0);
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Удалить пользователя?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const toggleRole = async (id: string, currentRole: number) => {
    const newRole = currentRole === 1 ? 0 : 1;
    await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role_id: newRole }),
    });
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role_id: newRole } : u))
    );
  };

  if (loading) return <p>Загрузка пользователей...</p>;

  return (
    <div className="space-y-8">
      <div className="border p-4 rounded bg-gray-50 shadow">
        <h2 className="text-xl font-semibold mb-4">
          Добавить нового пользователя
        </h2>
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(Number(e.target.value))}
            className="border p-2 rounded w-full"
          >
            <option value={0}>Пользователь</option>
            <option value={1}>Админ</option>
          </select>
          <button
            onClick={createUser}
            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
          >
            Добавить
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Роль</th>
              <th className="border p-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">
                  {user.role_id === 1 ? "Админ" : "Пользователь"}
                </td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => toggleRole(user.id, user.role_id)}
                    className="text-blue-600 hover:underline"
                  >
                    Сменить роль
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:underline"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
