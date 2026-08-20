import { useState, useEffect } from "react";

interface WeaponData {
  weapon_id: number;
  name: string;
  description: string;
  lore: string;
  image_url:string
  universe_id: number;
}

export default function WeaponCards() {
  const [weaponData, setWeaponData] = useState<WeaponData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function getWeapons() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/v1/weapons/");

      if (!response.ok) {
        throw new Error("Failed to fetch weapons");
      }

      const result = await response.json();

      console.log(result);

      setWeaponData(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getWeapons();
  }, []);

  if (loading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  return (
    <section className="flex flex-row gap-20">
      {weaponData.map((weapon) => (
        <div key={weapon.weapon_id} className="card bg-base-100 w-96 shadow-lg">
          <figure>
            <img style={{minHeight:350, maxHeight:350, objectFit:"cover", width:"100%"}}
              src={weapon.image_url}
              alt={weapon.name}
            />
          </figure>

          <div className="card-body">
            <h2 className="card-title">{weapon.name}</h2>

            <h2 className="font-bold">Universe ID:</h2>
            <p>{weapon.universe_id}</p>

            <h2 className="font-bold">Description:</h2>
            <p>{weapon.description}</p>

            <h2 className="font-bold">Lore:</h2>
            <p>{weapon.lore}</p>

            <div className="card-actions justify-end">
              <button className="btn btn-primary">View Weapon</button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
