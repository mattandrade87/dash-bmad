-- Script SQL para adicionar categorias padrão para todos os usuários
-- Execute este script se você não tiver categorias no banco

-- Para cada usuário existente, criar categorias padrão
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT id FROM "User" LOOP
        -- Receitas (INCOME)
        INSERT INTO "Category" ("id", "name", "color", "icon", "type", "userId", "isDefault", "createdAt", "updatedAt")
        VALUES 
            (gen_random_uuid(), 'Salário', '#00B894', '💼', 'INCOME', user_record.id, true, NOW(), NOW()),
            (gen_random_uuid(), 'Freelance', '#00B894', '💻', 'INCOME', user_record.id, true, NOW(), NOW()),
            (gen_random_uuid(), 'Investimentos', '#00B894', '📈', 'INCOME', user_record.id, true, NOW(), NOW()),
            (gen_random_uuid(), 'Outras Receitas', '#00B894', '💰', 'INCOME', user_record.id, true, NOW(), NOW())
        ON CONFLICT DO NOTHING;

        -- Despesas (EXPENSE)
        INSERT INTO "Category" ("id", "name", "color", "icon", "type", "userId", "isDefault", "createdAt", "updatedAt")
        VALUES 
            (gen_random_uuid(), 'Alimentação', '#FF6B6B', '🍔', 'EXPENSE', user_record.id, true, NOW(), NOW()),
            (gen_random_uuid(), 'Transporte', '#FF6B6B', '🚗', 'EXPENSE', user_record.id, true, NOW(), NOW()),
            (gen_random_uuid(), 'Moradia', '#FF6B6B', '🏠', 'EXPENSE', user_record.id, true, NOW(), NOW()),
            (gen_random_uuid(), 'Saúde', '#FF6B6B', '⚕️', 'EXPENSE', user_record.id, true, NOW(), NOW()),
            (gen_random_uuid(), 'Educação', '#FF6B6B', '📚', 'EXPENSE', user_record.id, true, NOW(), NOW()),
            (gen_random_uuid(), 'Lazer', '#FF6B6B', '🎮', 'EXPENSE', user_record.id, true, NOW(), NOW()),
            (gen_random_uuid(), 'Compras', '#FF6B6B', '🛍️', 'EXPENSE', user_record.id, true, NOW(), NOW()),
            (gen_random_uuid(), 'Contas', '#FF6B6B', '📄', 'EXPENSE', user_record.id, true, NOW(), NOW()),
            (gen_random_uuid(), 'Outras Despesas', '#FF6B6B', '💸', 'EXPENSE', user_record.id, true, NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$;
