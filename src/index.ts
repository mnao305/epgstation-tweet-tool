import Twitter from 'twit'
import { readFileSync } from 'fs'
import { join } from 'path'

type Arguments = 'reserve' | 'start' | 'end' | 'recfailed'

interface Program {
  channelName: string
  title: string
  description: string
  startAt: Date
  endAt: Date
}

interface TwitterToken {
  consumer_key: string
  consumer_secret: string
  access_token: string
  access_token_secret: string
}

interface Config {
  twitter_token: TwitterToken
}

const CONFIG = JSON.parse(readFileSync(join(__dirname, './config.json'), 'utf8')) as Config

const getProgramInfo = (): Program => {
  return {
    channelName: process.env.CHANNELNAME ?? '',
    title: process.env.NAME as string,
    description: process.env.DESCRIPTION ?? '',
    startAt: new Date(Number(process.env.STARTAT)),
    endAt: new Date(Number(process.env.ENDAT))
  }
}

const formatDate = (date: Date): string => {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}

const createTweetText = (mode: Arguments, programInfo: Program): string => {
  let text = ''
  const dateString = `${formatDate(programInfo.startAt)} 〜 ${formatDate(programInfo.endAt)}`
  switch (mode) {
    case 'reserve':
      // 録画予約時
      text += `【予約追加】 ${programInfo.channelName} ${dateString}\n${programInfo.title}\n${programInfo.description}`
      break
    case 'start':
      // 録画開始時
      text += `【録画開始】 ${programInfo.channelName} ${dateString}\n${programInfo.title}`
      break
    case 'end':
      // 録画終了時
      text += `【録画終了】 ${programInfo.channelName} ${dateString}\n${programInfo.title}`
      break
    case 'recfailed':
      // 録画中のエラー発生時
      text += `【録画エラー】 ${programInfo.channelName} ${dateString}\n${programInfo.title}`
      break
    default:
      // 一致しなかったら抜ける
      throw new Error('Arguments did not match')
  }
  return text
}

const tweet = (tweetText: string): void => {
  const client = new Twitter(CONFIG.twitter_token)
  client.post('statuses/update', {
    status: tweetText
  }).catch((e) => {
    console.error(e)
  })
}

const main = (arg: Arguments): void => {
  const text = createTweetText(arg, getProgramInfo())
  tweet(text)
}

main(process.argv[2] as Arguments)
