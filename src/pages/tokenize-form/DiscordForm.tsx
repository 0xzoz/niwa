import { FunctionComponent, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../../components/Form'
import { TokenizeContext } from '../../context/tokenizeContext'
import HSButton from '../../components/HSButton'
import TermsCheckBox from './TermsCheckBox'

interface DiscordFormProps {}

const DiscordForm: FunctionComponent<DiscordFormProps> = () => {
  const navigate = useNavigate()
  const {
    network,
    address,
    tokenName,
    setTokenName,
    tokenSymbol,
    setTokenSymbol,
    agreedToTerms,
    setAgreedToTerms,
    isValid,
    personalAccessToken,
    assetName
  } = useContext(TokenizeContext)

  const onAuthDiscordAccount = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID
    const redirectUri = encodeURI((import.meta.env.VITE_DISCORD_AUTH_REDIRECT_URI as string) || '')
    const scope = encodeURI('guilds')
    const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&prompt=consent`

    window.location.assign(url)
  }

  const onPreview = () => {
    if (!isValid) {
      return
    }
    navigate('/tokenize/discord/preview')
  }

  return (
    <div className="flex flex-col">
      {assetName && personalAccessToken ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-sm my-8">
            <p>Channel ID: {assetName}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
            <FormField
              label="Network"
              id="network"
              required={true}
              value={network?.name ?? ''}
              placeholder="Please Connect Wallet"
              disabled={true}
            >
              <span className="text-sm font-bold mb-6">Minting only available on Arbitrum and Polyon.</span>
            </FormField>
            <FormField
              label="Your Wallet Address"
              id="address"
              required={true}
              value={address}
              placeholder="Please Connect Wallet"
              disabled={true}
            />
            <FormField
              label="Token Name"
              id="tokenName"
              required={true}
              value={tokenName}
              onChange={val => setTokenName(val)}
            />
            <FormField
              label="Token Symbol"
              id="tokenSymbol"
              required={true}
              value={tokenSymbol}
              onChange={val => {
                if (val.length <= 4) {
                  setTokenSymbol(val.toUpperCase())
                }
              }}
            >
              <span className="text-sm">Symbol should be 3 to 4 characters long (for example DEV)</span>
            </FormField>
          </div>
          <TermsCheckBox isChecked={agreedToTerms} setAgreedToTerms={async () => setAgreedToTerms(val => !val)} />
          <div className="float-right flex flex-col items-end">
            <HSButton context="submit" type="filled" isDisabled={!isValid} onClick={onPreview}>
              Preview
            </HSButton>
          </div>
        </>
      ) : (
        <div className="float-right flex flex-col items-center">
          <HSButton context="submit" type="filled" isDisabled={false} onClick={onAuthDiscordAccount}>
            Authorize Discord Account
          </HSButton>
        </div>
      )}
    </div>
  )
}

export default DiscordForm
