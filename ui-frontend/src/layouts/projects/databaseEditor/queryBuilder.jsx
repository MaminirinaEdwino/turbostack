import React, { useState, useMemo } from "react";

export default function QueryBuilder({ tables = [], onClose }) {
    // 1. États pour la construction de la requête
    const [selectedTable, setSelectedTable] = useState(tables[0]?.nom || "");
    const [action, setAction] = useState("SELECT");
    const [selectedFields, setSelectedFields] = useState([]);

    // NOUVEAU : État pour gérer la liste des jointures
    const [joins, setJoins] = useState([]);

    const [whereClause, setWhereClause] = useState({ field: "", operator: "=", value: "" });
    const [orderBy, setOrderBy] = useState({ field: "", direction: "ASC font-mono" });
    const [limit, setLimit] = useState("");
    const [copied, setCopied] = useState(false);

    // Récupération des objets de tables
    const currentTableObj = useMemo(() => {
        return tables.find((t) => t.nom === selectedTable) || null;
    }, [tables, selectedTable]);

    // Récupération de tous les champs disponibles (Table Principale + Tables Jointes)
    const availableFieldsWithTable = useMemo(() => {
        let fields = [];
        if (currentTableObj) {
            currentTableObj.champs.forEach((c) => fields.push({ table: selectedTable, champ: c.nom }));
        }
        joins.forEach((j) => {
            const joinedTableObj = tables.find((t) => t.nom === j.table);
            if (joinedTableObj) {
                joinedTableObj.champs.forEach((c) => fields.push({ table: j.table, champ: c.nom }));
            }
        });
        return fields;
    }, [tables, selectedTable, currentTableObj, joins]);

    // Changement de table principale
    const handleTableChange = (tableName) => {
        setSelectedTable(tableName);
        const targetTable = tables.find((t) => t.nom === tableName);
        if (targetTable) {
            setSelectedFields(targetTable.champs.map((c) => `${tableName}.${c.nom}`));
        } else {
            setSelectedFields([]);
        }
        setJoins([]); // Réinitialiser les jointures
    };

    // Gestion des jointures
    const addJoin = () => {
        const availableTables = tables.filter((t) => t.nom !== selectedTable);
        if (availableTables.length === 0) return;

        const targetTable = availableTables[0];
        setJoins((prev) => [
            ...prev,
            {
                type: "INNER JOIN",
                table: targetTable.nom,
                leftField: `${selectedTable}.${currentTableObj?.champs[0]?.nom || "id"}`,
                rightField: `${targetTable.nom}.${targetTable.champs[0]?.nom || "id"}`,
            },
        ]);
    };

    const updateJoin = (index, key, value) => {
        setJoins((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [key]: value };
            return updated;
        });
    };

    const removeJoin = (index) => {
        setJoins((prev) => prev.filter((_, i) => i !== index));
    };

    // Toggle la sélection d'un champ
    const toggleField = (fullFieldName) => {
        setSelectedFields((prev) =>
            prev.includes(fullFieldName)
                ? prev.filter((f) => f !== fullFieldName)
                : [...prev, fullFieldName]
        );
    };

    // 2. Générateur dynamique de requête SQL avec JOIN
    const generatedQuery = useMemo(() => {
        if (!selectedTable) return "-- Veuillez sélectionner une table";

        const fieldsStr = selectedFields.length > 0 ? selectedFields.join(", ") : "*";
        let query = "";

        switch (action) {
            case "SELECT":
                query = `SELECT ${fieldsStr}\nFROM ${selectedTable}`;
                break;
            case "INSERT":
                query = `INSERT INTO ${selectedTable} (${selectedFields.join(", ")})\nVALUES (...)`;
                break;
            case "UPDATE":
                query = `UPDATE ${selectedTable}\nSET ...`;
                break;
            case "DELETE":
                query = `DELETE FROM ${selectedTable}`;
                break;
            default:
                query = "";
        }

        // Ajout des Clauses JOIN (Uniquement pour SELECT)
        if (action === "SELECT" && joins.length > 0) {
            joins.forEach((j) => {
                if (j.table && j.leftField && j.rightField) {
                    query += `\n${j.type} ${j.table} ON ${j.leftField} = ${j.rightField}`;
                }
            });
        }

        // Condition WHERE
        if (whereClause.field && whereClause.value) {
            const val = isNaN(whereClause.value) ? `'${whereClause.value}'` : whereClause.value;
            query += `\nWHERE ${whereClause.field} ${whereClause.operator} ${val}`;
        }

        // Tri (ORDER BY)
        if (action === "SELECT" && orderBy.field) {
            query += `\nORDER BY ${orderBy.field} ${orderBy.direction}`;
        }

        // Limite (LIMIT)
        if (action === "SELECT" && limit) {
            query += `\nLIMIT ${limit}`;
        }

        return query + ";";
    }, [selectedTable, action, selectedFields, joins, whereClause, orderBy, limit]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedQuery);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 shadow-xl transition-colors space-y-6">

            {/* En-tête */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">

                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            TurboStack Query Builder
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Generate SQL queries
                        </p>
                    </div>
                </div>
            </div>

            {/* Configuration Table & Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Table
                    </label>
                    <select
                        value={selectedTable}
                        onChange={(e) => handleTableChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80  text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:bg-gray-900 appearance-none"
                    >
                        {tables.map((t) => (
                            <option key={t.nom} value={t.nom}>
                                {t.nom}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5 flex flex-col justify-around">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        SQL Action
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {["SELECT", "INSERT", "UPDATE", "DELETE"].map((act) => (
                            <button
                                key={act}
                                type="button"
                                onClick={() => setAction(act)}
                                className={`py-2 text-xs font-bold rounded-lg border transition-all ${action === act
                                        ? "bg-couleur1 border-couleur1 text-white shadow-md shadow-indigo-500/20"
                                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                            >
                                {act}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* NOUVELLE SECTION : GESTION DES JOINTURES (Uniquement en mode SELECT) */}
            {action === "SELECT" && (
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            JOIN
                        </label>
                        <button
                            onClick={addJoin}
                            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-50 dark:bg-couleur1/50 border border-couleur1/30 text-couleur1 dark:text-couleur2 hover:bg-indigo-100 dark:hover:bg-couleur1/50 transition-colors"
                        >
                            + Add table to join
                        </button>
                    </div>

                    {joins.length === 0 ? (
                        <p className="text-xs text-slate-400 dark:text-slate-500 italic bg-slate-50/50 dark:bg-slate-950/30 p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                            Aucune jointure définie. Cliquez sur "+ Ajouter une jointure" pour lier deux tables.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {joins.map((join, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs "
                                >
                                    {/* Type de Jointure */}
                                    <select
                                        value={join.type}
                                        onChange={(e) => updateJoin(idx, "type", e.target.value)}
                                        className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold appearance-none"
                                    >
                                        <option value="INNER JOIN">INNER JOIN</option>
                                        <option value="LEFT JOIN">LEFT JOIN</option>
                                        <option value="RIGHT JOIN">RIGHT JOIN</option>
                                        <option value="FULL JOIN">FULL JOIN</option>
                                    </select>

                                    {/* Table à Joindre */}
                                    <select
                                        value={join.table}
                                        onChange={(e) => updateJoin(idx, "table", e.target.value)}
                                        className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 appearance-none"
                                    >
                                        {tables
                                            .filter((t) => t.nom !== selectedTable)
                                            .map((t) => (
                                                <option key={t.nom} value={t.nom}>
                                                    {t.nom}
                                                </option>
                                            ))}
                                    </select>

                                    <span className="text-slate-400 font-bold">ON</span>

                                    {/* Champ Gauche (Table Principale) */}
                                    <select
                                        value={join.leftField}
                                        onChange={(e) => updateJoin(idx, "leftField", e.target.value)}
                                        className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono appearance-none"
                                    >
                                        {currentTableObj?.champs.map((c) => (
                                            <option key={c.nom} value={`${selectedTable}.${c.nom}`}>
                                                {selectedTable}.{c.nom}
                                            </option>
                                        ))}
                                    </select>

                                    <span className="text-slate-400 font-bold">=</span>

                                    {/* Champ Droite (Table Jointe) */}
                                    <select
                                        value={join.rightField}
                                        onChange={(e) => updateJoin(idx, "rightField", e.target.value)}
                                        className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono appearance-none"
                                    >
                                        {tables
                                            .find((t) => t.nom === join.table)
                                            ?.champs.map((c) => (
                                                <option key={c.nom} value={`${join.table}.${c.nom}`}>
                                                    {join.table}.{c.nom}
                                                </option>
                                            ))}
                                    </select>

                                    {/* Bouton Supprimer Jointure */}
                                    <button
                                        onClick={() => removeJoin(idx)}
                                        className="ml-auto p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Sélection des Champs (Avec préfixe Table.Champ) */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Selected Fields
                </label>

                <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                    {availableFieldsWithTable.map(({ table, champ }) => {
                        const fullFieldName = `${table}.${champ}`;
                        const isSelected = selectedFields.includes(fullFieldName);
                        return (
                            <button
                                key={fullFieldName}
                                onClick={() => toggleField(fullFieldName)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${isSelected
                                        ? "bg-indigo-50 dark:bg-couleur1 border-couleur2 text-couleur2 dark:text-couleur2 font-semibold"
                                        : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                                    }`}
                            >
                                <span>{isSelected ? "✓" : "+"}</span>
                                <span>{fullFieldName}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Conditions WHERE, ORDER BY, LIMIT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Filtre WHERE
                    </label>
                    <div className="flex gap-1.5">
                        <select
                            value={whereClause.field}
                            onChange={(e) => setWhereClause({ ...whereClause, field: e.target.value })}
                            className="w-1/3 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono appearance-none"
                        >
                            <option value="">Champ</option>
                            {availableFieldsWithTable.map(({ table, champ }) => (
                                <option key={`${table}.${champ}`} value={`${table}.${champ}`}>
                                    {table}.{champ}
                                </option>
                            ))}
                        </select>
                        <select
                            value={whereClause.operator}
                            onChange={(e) => setWhereClause({ ...whereClause, operator: e.target.value })}
                            className="w-1/4 px-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs appearance-none"
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
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs appearance-none"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Tri (ORDER BY)
                    </label>
                    <div className="flex gap-1.5">
                        <select
                            value={orderBy.field}
                            onChange={(e) => setOrderBy({ ...orderBy, field: e.target.value })}
                            className="flex-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono appearance-none"
                        >
                            <option value="">Aucun tri</option>
                            {availableFieldsWithTable.map(({ table, champ }) => (
                                <option key={`${table}.${champ}`} value={`${table}.${champ}`}>
                                    {table}.{champ}
                                </option>
                            ))}
                        </select>
                        <select
                            value={orderBy.direction}
                            onChange={(e) => setOrderBy({ ...orderBy, direction: e.target.value })}
                            className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs appearance-none"
                        >
                            <option value="ASC">ASC</option>
                            <option value="DESC">DESC</option>
                        </select>
                    </div>
                </div>

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

            {/* Visualisation de la Requête Générée */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        {/* <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> */}
                        SQL Query
                    </span>
                    <button
                        onClick={copyToClipboard}
                        className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {copied ? "✓ Copied !" : "Copy SQL"}
                    </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-sm leading-relaxed overflow-x-auto shadow-inner">
                    <pre className="text-emerald-400 font-semibold">{generatedQuery}</pre>
                </div>
            </div>
            <button onClick={() => onClose()} className="text-white px-5 py-2 hover:bg-red-500 rounded-md transition-all duration-150">close</button>
        </div>
    );
}