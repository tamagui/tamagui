/** @type {import('next').NextConfig} */
import * as withTamagui from '@tamagui/next-plugin' 

function nextConfig (name, { defaultConfig }) {

    let config = {

    ...defaultConfig,

    // ...your configuration

    }
    const tamaguiPlugin = withTamagui.default.withTamagui({

    config: './tamagui.config.ts',

    components: ['tamagui'],

    appDir: true,
    // build-time generate CSS styles for better performance

    // we recommend only using this for production so you get reloading during dev mode

    outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
    // optional advanced settings:
    // set to false if you never call addTheme or updateTheme

    })
    return {

    ...config,

    ...tamaguiPlugin(config),

    }

}


export default nextConfig;