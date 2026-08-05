import React, { useState, useMemo } from "react";

export default function QueryBuilder({ tables = [] }) {
    // 1. États pour la construction de la requête
    const [selectedTable, setSelectedTable] = useState(tables[0]?.nom || "");
    const [action, setAction] = useState("SELECT");
    const [selectedFields, setSelectedFields] = useState([]);
    const [whereClause, setWhereClause] = useState({ field: "", operator: "=", value: "" });
    const [orderBy, setOrderBy] = useState({ field: "", direction: "ASC" });
    const [limit, setLimit] = useState("");
    const [copied, setCopied] = useState(false);

    console.log(tables)
    // Récupération de la table actuellement sélectionnée
    const currentTableObj = useMemo(() => {
        return tables.find((t) => t.nom === selectedTable) || null;
    }, [tables, selectedTable]);

    // Changement de table -> Réinitialiser les champs sélectionnés
    const handleTableChange = (tableName) => {
        setSelectedTable(tableName);
        const targetTable = tables.find((t) => t.nom === tableName);
        if (targetTable) {
            // Sélectionne tous les champs par défaut
            setSelectedFields(targetTable.champs.map((c) => c.nom));
        } else {
            setSelectedFields([]);
        }
    };

    // Toggle la sélection d'un champ
    const toggleField = (fieldName) => {
        setSelectedFields((prev) =>
            prev.includes(fieldName)
                ? prev.filter((f) => f !== fieldName)
                : [...prev, fieldName]
        );
    };

    // 2. Générateur dynamique de requête SQL
    const generatedQuery = useMemo(() => {
        if (!selectedTable) return "-- Veuillez sélectionner une table";

        const fieldsStr = selectedFields.length > 0 ? selectedFields.join(", ") : "*";
        let query = "";

        switch (action) {
            case "SELECT":
                query = `SELECT ${fieldsStr} FROM ${selectedTable}`;
                break;
            case "INSERT":
                {
                    const insertFields = selectedFields.length > 0 ? selectedFields.join(", ") : "field1, field2";
                    const placeholders = selectedFields.length > 0
                        ? selectedFields.map((_, i) => `$${i + 1}`).join(", ")
                        : "$1, $2";
                    query = `INSERT INTO ${selectedTable} (${insertFields})\nVALUES (${placeholders})`;
                    break;
                }
            case "UPDATE":
                {
                    const setClause = selectedFields.length > 0
                        ? selectedFields.map((f, i) => `${f} = $${i + 1}`).join(", ")
                        : "field1 = $1";
                    query = `UPDATE ${selectedTable}\nSET ${setClause}`;
                    break;
                }
            case "DELETE":
                query = `DELETE FROM ${selectedTable}`;
                break;
            default:
                query = "";
        }

        // Condition WHERE
        if (whereClause.field && whereClause.value) {
            const val = isNaN(whereClause.value) ? `'${whereClause.value}'` : whereClause.value;
            query += `\nWHERE ${whereClause.field} ${whereClause.operator} ${val}`;
        }

        // Tri (ORDER BY) - uniquement pour SELECT
        if (action === "SELECT" && orderBy.field) {
            query += `\nORDER BY ${orderBy.field} ${orderBy.direction}`;
        }

        // Limite (LIMIT) - uniquement pour SELECT
        if (action === "SELECT" && limit) {
            query += `\nLIMIT ${limit}`;
        }

        return query + ";";
    }, [selectedTable, action, selectedFields, whereClause, orderBy, limit]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedQuery);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl transition-colors space-y-6">

            {/* En-tête TurboStack DBEditor */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                        ⚡
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            TurboStack DBEditor — Query Builder
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Générez et visualisez vos requêtes SQL graphiquement
                        </p>
                    </div>
                </div>
            </div>

            {/* Grille de configuration : Tables & Opérations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Choix de la Table */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Table Cible
                    </label>
                    <select
                        value={selectedTable}
                        onChange={(e) => handleTableChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                        {tables.map((t) => (
                            <option key={t.nom} value={t.nom}>
                                📊 {t.nom}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Action SQL (SELECT, INSERT, etc.) */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Action SQL
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {["SELECT", "INSERT", "UPDATE", "DELETE"].map((act) => (
                            <button
                                key={act}
                                type="button"
                                onClick={() => setAction(act)}
                                className={`py-2 text-xs font-bold rounded-lg border transition-all ${action === act
                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20"
                                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                            >
                                {act}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sélection des Champs */}
            {currentTableObj && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Champs à inclure
                        </label>
                        <button
                            onClick={() =>
                                setSelectedFields(
                                    selectedFields.length === currentTableObj.champs.length
                                        ? []
                                        : currentTableObj.champs.map((c) => c.nom)
                                )
                            }
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                        >
                            {selectedFields.length === currentTableObj.champs.length
                                ? "Tout désélectionner"
                                : "Tout sélectionner"}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                        {currentTableObj.champs.map((champ) => {
                            const isSelected = selectedFields.includes(champ.nom);
                            return (
                                <button
                                    key={champ.nom}
                                    onClick={() => toggleField(champ.nom)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${isSelected
                                        ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-semibold"
                                        : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                                        }`}
                                >
                                    <span>{isSelected ? "✓" : "+"}</span>
                                    <span>{champ.nom}</span>
                                    <span className="text-[10px] opacity-60">({champ.type})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Conditions et Contraintes (WHERE, ORDER BY, LIMIT) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">

                {/* Clause WHERE */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Filtre WHERE
                    </label>
                    <div className="flex gap-1.5">
                        <select
                            value={whereClause.field}
                            onChange={(e) => setWhereClause({ ...whereClause, field: e.target.value })}
                            className="w-1/3 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                        >
                            <option value="">Champ</option>
                            {currentTableObj?.champs.map((c) => (
                                <option key={c.nom} value={c.nom}>{c.nom}</option>
                            ))}
                        </select>
                        <select
                            value={whereClause.operator}
                            onChange={(e) => setWhereClause({ ...whereClause, operator: e.target.value })}
                            className="w-1/4 px-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                        >
                            <option value="=">=</option>
                            <option value="!=">!=</option>
                            <option value=">">&gt;</option>
                            <option value="<">&lt;</option>
                            <option value="LIKE">LIKE</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Valeur"
                            value={whereClause.value}
                            onChange={(e) => setWhereClause({ ...whereClause, value: e.target.value })}
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                        />
                    </div>
                </div>

                {/* Clause ORDER BY */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Tri (ORDER BY)
                    </label>
                    <div className="flex gap-1.5">
                        <select
                            value={orderBy.field}
                            onChange={(e) => setOrderBy({ ...orderBy, field: e.target.value })}
                            className="flex-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                        >
                            <option value="">Aucun tri</option>
                            {currentTableObj?.champs.map((c) => (
                                <option key={c.nom} value={c.nom}>{c.nom}</option>
                            ))}
                        </select>
                        <select
                            value={orderBy.direction}
                            onChange={(e) => setOrderBy({ ...orderBy, direction: e.target.value })}
                            className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                        >
                            <option value="ASC">ASC</option>
                            <option value="DESC">DESC</option>
                        </select>
                    </div>
                </div>

                {/* Clause LIMIT */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Limite (LIMIT)
                    </label>
                    <input
                        type="number"
                        placeholder="Ex: 50"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                    />
                </div>
            </div>

            {/* Visualisation de la Requête Générée (Console SQL) */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Requête Générée
                    </span>
                    <button
                        onClick={copyToClipboard}
                        className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {copied ? "✓ Copié !" : "📋 Copier SQL"}
                    </button>
                </div>

                <div className="relative p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-sm leading-relaxed overflow-x-auto shadow-inner">
                    <pre className="text-emerald-400 font-semibold">{generatedQuery}</pre>
                </div>
            </div>

        </div>
    );
}