class DaltonismType {
    constructor(nome, codigo, descricao, filterConfig) {
        this.nome = nome;                    // Ex: "Protanopia"
        this.codigo = codigo;                // Ex: "P", "D", "T", "N"
        this.descricao = descricao;
        this.filterConfig = filterConfig;    // Objeto com configurações CSS/Canvas
    }
}

// Exemplos de instâncias (podes criar num ficheiro separado) pouco trabalhado, só para exemplificar
export const DALTONISM_TYPES = {
    NORMAL: new DaltonismType("Visão Normal", "N", "Visão padrão", {}),
    PROTANOPIA: new DaltonismType("Protanopia", "P", "Ausência de vermelho", { filter: "protanopia" }),
    DEUTERANOPIA: new DaltonismType("Deuteranopia", "D", "Ausência de verde", { filter: "deuteranopia" }),
    TRITANOPIA: new DaltonismType("Tritanopia", "T", "Ausência de azul", { filter: "tritanopia" })
};

export default DaltonismType;