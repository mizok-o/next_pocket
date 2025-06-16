import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/supabaseClient'

async function extractMetadata(url: string) {
  try {
    const response = await fetch(url)
    const html = await response.text()
    
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : url
    
    const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) ||
                           html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i)
    const description = descriptionMatch ? descriptionMatch[1].trim() : undefined
    
    const imageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i) ||
                      html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"[^>]*>/i)
    const imageUrl = imageMatch ? imageMatch[1].trim() : undefined
    
    return { title, description, imageUrl }
  } catch (error) {
    console.error('Error extracting metadata:', error)
    return { title: url, description: undefined, imageUrl: undefined }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URLが必要です' }, { status: 400 })
    }
    
    const urlPattern = /^https?:\/\/.+/
    if (!urlPattern.test(url)) {
      return NextResponse.json({ error: '有効なURLを入力してください' }, { status: 400 })
    }
    
    const { title, description, imageUrl } = await extractMetadata(url)
    
    const { data, error } = await supabase
      .from('urls')
      .insert([
        {
          url,
          title,
          description,
          image_url: imageUrl,
        }
      ])
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'URLの保存に失敗しました' }, { status: 500 })
    }
    
    return NextResponse.json({ data, message: 'URLが正常に保存されました' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}