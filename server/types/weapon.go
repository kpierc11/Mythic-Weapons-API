package types

type Weapon struct {
	WeaponID    int         `json:"weapon_id"`
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Data        interface{} `json:"data,omitempty"`
}
