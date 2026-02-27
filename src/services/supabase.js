<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js'

// Берем переменные из import.meta.env (Vite)
// Vercel добавил их с разными префиксами
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                    import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
                    import.meta.env.SUPABASE_URL

const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
                    import.meta.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found! Check environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseKey
  })
}

console.log('✅ Supabase config loaded:', { 
  url: supabaseUrl ? 'present' : 'missing',
  key: supabaseKey ? 'present' : 'missing' 
})

const supabase = createClient(supabaseUrl, supabaseKey)

// Загрузка данных
export const loadData = async () => {
  try {
    const { data, error } = await supabase
      .from('lssd_data')
      .select('data')
      .eq('id', 1)
      .maybeSingle() // Используем maybeSingle вместо single чтобы не было ошибки если записи нет
    
    if (error) {
      console.error('Supabase load error:', error)
      return { officers: [], keys: [] }
    }
    
    return data?.data || { officers: [], keys: [] }
  } catch (error) {
    console.error('Supabase load error:', error)
    return { officers: [], keys: [] }
  }
}

// Сохранение данных
export const saveData = async (content) => {
  try {
    // Проверяем, существует ли запись
    const { data: existing } = await supabase
      .from('lssd_data')
      .select('id')
      .eq('id', 1)
      .maybeSingle()
    
    if (existing) {
      // Обновляем
      const { error } = await supabase
        .from('lssd_data')
        .update({ 
          data: content,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1)
      
      if (error) throw error
    } else {
      // Создаем новую запись
      const { error } = await supabase
        .from('lssd_data')
        .insert([{ 
          id: 1, 
          data: content,
          updated_at: new Date().toISOString()
        }])
      
      if (error) throw error
    }
    
    return true
  } catch (error) {
    console.error('Supabase save error:', error)
    return false
  }
}

// Подписка на изменения (реальное время)
export const subscribeToChanges = (callback) => {
  return supabase
    .channel('lssd_changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'lssd_data',
        filter: 'id=eq.1'
      },
      (payload) => {
        console.log('Data changed:', payload)
        if (payload.new && payload.new.data) {
          callback(payload.new.data)
        }
      }
    )
    .subscribe()
}

// Инициализация и проверка соединения
export const initDatabase = async () => {
  try {
    // Проверяем соединение простым запросом
    const { error } = await supabase
      .from('lssd_data')
      .select('id')
      .limit(1)
    
    if (error && error.code === '42P01') {
      console.log('📝 Table lssd_data does not exist. Creating...')
      
      // Создаем таблицу через SQL (если есть права)
      const { error: sqlError } = await supabase.rpc('create_lssd_table')
      
      if (sqlError) {
        console.log('⚠️ Please create table manually in Supabase dashboard')
        return false
      }
    }
    
    console.log('✅ Supabase connected successfully')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
=======
import { createClient } from '@supabase/supabase-js'

// Берем переменные из import.meta.env (Vite)
// Vercel добавил их с разными префиксами
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                    import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
                    import.meta.env.SUPABASE_URL

const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
                    import.meta.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found! Check environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseKey
  })
}

console.log('✅ Supabase config loaded:', { 
  url: supabaseUrl ? 'present' : 'missing',
  key: supabaseKey ? 'present' : 'missing' 
})

const supabase = createClient(supabaseUrl, supabaseKey)

// Загрузка данных
export const loadData = async () => {
  try {
    const { data, error } = await supabase
      .from('lssd_data')
      .select('data')
      .eq('id', 1)
      .maybeSingle() // Используем maybeSingle вместо single чтобы не было ошибки если записи нет
    
    if (error) {
      console.error('Supabase load error:', error)
      return { officers: [], keys: [] }
    }
    
    return data?.data || { officers: [], keys: [] }
  } catch (error) {
    console.error('Supabase load error:', error)
    return { officers: [], keys: [] }
  }
}

// Сохранение данных
export const saveData = async (content) => {
  try {
    // Проверяем, существует ли запись
    const { data: existing } = await supabase
      .from('lssd_data')
      .select('id')
      .eq('id', 1)
      .maybeSingle()
    
    if (existing) {
      // Обновляем
      const { error } = await supabase
        .from('lssd_data')
        .update({ 
          data: content,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1)
      
      if (error) throw error
    } else {
      // Создаем новую запись
      const { error } = await supabase
        .from('lssd_data')
        .insert([{ 
          id: 1, 
          data: content,
          updated_at: new Date().toISOString()
        }])
      
      if (error) throw error
    }
    
    return true
  } catch (error) {
    console.error('Supabase save error:', error)
    return false
  }
}

// Подписка на изменения (реальное время)
export const subscribeToChanges = (callback) => {
  return supabase
    .channel('lssd_changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'lssd_data',
        filter: 'id=eq.1'
      },
      (payload) => {
        console.log('Data changed:', payload)
        if (payload.new && payload.new.data) {
          callback(payload.new.data)
        }
      }
    )
    .subscribe()
}

// Инициализация и проверка соединения
export const initDatabase = async () => {
  try {
    // Проверяем соединение простым запросом
    const { error } = await supabase
      .from('lssd_data')
      .select('id')
      .limit(1)
    
    if (error && error.code === '42P01') {
      console.log('📝 Table lssd_data does not exist. Creating...')
      
      // Создаем таблицу через SQL (если есть права)
      const { error: sqlError } = await supabase.rpc('create_lssd_table')
      
      if (sqlError) {
        console.log('⚠️ Please create table manually in Supabase dashboard')
        return false
      }
    }
    
    console.log('✅ Supabase connected successfully')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
>>>>>>> 931dd75ada31e09a7b2d968f5be864081780f501
}