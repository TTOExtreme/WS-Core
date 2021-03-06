
/**
 * @typedef {ProdutosStruct} ProdutosStruct
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} barcode
 * @property {string} price
 * @property {string} cost
 * @property {string} img
 * @property {number} inventory
 * @property {timestamp} createdIn
 * @property {number} createdBy
 * @property {timestamp} deactivatedIn
 * @property {number} deactivatedBy
 * @property {boolean} active
 */


class ProdutosStruct {
    id;
    id_li;
    name;
    description;
    barcode;
    price;
    cost;
    inventory;
    createdIn;
    createdBy;
    deactivatedIn;
    deactivatedBy;
    modifiedIn;
    modifiedBy;
    active;

    /**
     * converte um JSON para o objeto GROUP
     * @param {JSON} user JSON contendo os items do Grupo 
     */
    constructor(os) {
        if (os) {
            if (os.id) { this.id = os.id }
            if (os.name) { this.name = os.name }
            if (os.description) { this.description = os.description }
            if (os.barcode) { this.barcode = os.barcode }
            if (os.price) { this.price = os.price }
            if (os.cost) { this.cost = os.cost }
            if (os.inventory) { this.inventory = os.inventory }
            if (os.img) { this.img = os.img }
            if (os.createdIn) { this.createdIn = os.createdIn }
            if (os.createdBy) { this.createdBy = os.createdBy }
            if (os.deactivatedIn) { this.deactivatedIn = os.deactivatedIn }
            if (os.deactivatedBy) { this.deactivatedBy = os.deactivatedBy }
            if (os.modifiedIn) { this.modifiedIn = os.modifiedIn }
            if (os.modifiedBy) { this.modifiedBy = os.modifiedBy }
            if (os.active) { this.active = os.active }
        }
    }

    /**
     * Converte Em String o Objeto GROUP
     */
    toString() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            description: this.description,
            barcode: this.barcode,
            price: this.price,
            cost: this.cost,
            inventory: this.inventory,
            img: this.img,
            createdIn: this.createdIn,
            createdBy: this.createdBy,
            deactivatedIn: this.deactivatedIn,
            deactivatedBy: this.deactivatedBy,
            modifiedIn: this.modifiedIn,
            modifiedBy: this.modifiedBy,
            active: this.active,
        })
    }
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    id_li: "VARCHAR(60)",
    name: "VARCHAR(200)",
    description: "TEXT",
    barcode: "VARCHAR(200)",
    price: "VARCHAR(200)",
    priceRevenda: "VARCHAR(200)",
    cost: "VARCHAR(200)",
    inventory: "BIGINT",
    img: "TEXT",
    url: "VARCHAR(600)",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
    active: "INT(1)",
    revenda: "INT(1)",
    privatelabel: "INT(1)",
}


module.exports = { ProdutosStruct, _DB }