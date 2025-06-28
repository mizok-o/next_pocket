import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー - Ato（あと）',
  description: 'Ato（あと）Chrome拡張機能のプライバシーポリシーです。',
}

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 prose prose-lg">
      <h1 className="text-3xl font-bold border-b-2 border-gray-200 pb-3 mb-6">
        Ato（あと）プライバシーポリシー
      </h1>
      <p className="text-gray-600 text-sm mb-8">最終更新日: 2025年1月28日</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. はじめに</h2>
        <p>
          Ato（あと）Chrome拡張機能（以下「本拡張機能」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。このプライバシーポリシーは、本拡張機能がどのような情報を収集し、どのように使用するかを説明します。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. 収集する情報</h2>
        <p className="mb-3">本拡張機能は以下の情報を収集します：</p>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>URL情報</strong>: ユーザーが保存を選択したウェブページのURL</li>
          <li><strong>ページメタデータ</strong>: ページタイトル、説明文、OGP画像のURL</li>
          <li><strong>認証情報</strong>: Ato（あと）サービスへのログインに必要な認証トークン（ローカルストレージに保存）</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. 情報の使用目的</h2>
        <p className="mb-3">収集した情報は以下の目的で使用されます：</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>ユーザーが選択したURLをAto（あと）サービスに保存するため</li>
          <li>保存したブックマークの管理と表示のため</li>
          <li>ユーザー認証とセッション管理のため</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. 情報の保存と管理</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>認証トークンはブラウザのローカルストレージに暗号化して保存されます</li>
          <li>URL情報とメタデータはAto（あと）サービスのサーバーに送信され、保存されます</li>
          <li>本拡張機能自体はユーザーの閲覧履歴を収集・保存しません</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. 第三者への情報提供</h2>
        <p className="mb-3">本拡張機能は、以下の場合を除き、収集した情報を第三者に提供しません：</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>ユーザーの同意がある場合</li>
          <li>法令に基づく開示要請がある場合</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. データの保存期間</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>保存されたURLとメタデータ: ユーザーが削除するまで保持されます</li>
          <li>認証トークン: ログアウトまたは拡張機能のアンインストール時に削除されます</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. セキュリティ</h2>
        <p className="mb-3">本拡張機能は、収集した情報を保護するため、適切なセキュリティ対策を実施しています：</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>HTTPS通信によるデータの暗号化</li>
          <li>最小限の権限のみを要求</li>
          <li>定期的なセキュリティアップデート</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. ユーザーの権利</h2>
        <p className="mb-3">ユーザーは以下の権利を有します：</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>保存したデータの確認と削除</li>
          <li>拡張機能のアンインストールによる全データの削除</li>
          <li>プライバシーに関する問い合わせ</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. 変更について</h2>
        <p>
          本プライバシーポリシーは、必要に応じて更新される場合があります。重要な変更がある場合は、拡張機能を通じてユーザーに通知します。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. お問い合わせ</h2>
        <p>
          プライバシーに関するご質問やご懸念がある場合は、GitHubのIssueページからお問い合わせください。
        </p>
      </section>
    </div>
  )
}