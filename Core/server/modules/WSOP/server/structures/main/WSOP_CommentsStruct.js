
/**
 * @typedef {CommentsStruct} CommentsStruct
 * @property {number} id
 * @property {number} id_os
 * @property {string} content
 * @property {timestamp} createdIn
 * @property {number} createdBy
 * @property {timestamp} deactivatedIn
 * @property {number} deactivatedBy
 */


class CommentsStruct {
    id;
    id_os;
    content;
    createdIn;
    createdBy;
    deactivatedIn;
    deactivatedBy;
    modifiedIn;
    modifiedBy;
    tags;
    obs;

    /**
     * converte um JSON para o objeto GROUP
     * @param {JSON} user JSON contendo os items do Grupo 
     */
    constructor(os) {
        if (os) {
            if (os.id) { this.id = os.id }
            if (os.id_os) { this.id_os = os.id_os }
            if (os.content) { this.content = os.content }
            if (os.createdIn) { this.createdIn = os.createdIn }
            if (os.createdBy) { this.createdBy = os.createdBy }
            if (os.deactivatedIn) { this.deactivatedIn = os.deactivatedIn }
            if (os.deactivatedBy) { this.deactivatedBy = os.deactivatedBy }
            if (os.modifiedIn) { this.modifiedIn = os.modifiedIn }
            if (os.modifiedBy) { this.modifiedBy = os.modifiedBy }
            if (os.tags) { this.tags = os.tags }
            if (os.obs) { this.obs = os.obs }
        }
    }

    /**
     * Converte Em String o Objeto GROUP
     */
    toString() {
        return JSON.stringify({
            id: this.id,
            id_os: this.id_os,
            content: this.content,
            createdIn: this.createdIn,
            createdBy: this.createdBy,
            deactivatedIn: this.deactivatedIn,
            deactivatedBy: this.deactivatedBy,
            modifiedIn: this.modifiedIn,
            modifiedBy: this.modifiedBy,
            tags: this.tags,
            obs: this.obs
        })
    }
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    id_os: "INT",
    content: "MEDIUMTEXT",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
}


module.exports = { CommentsStruct, _DB }