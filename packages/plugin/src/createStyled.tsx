import { GetProps, GetVariantValues, StylableComponent, StyledContext, TamaguiComponent, VariantDefinitions, VariantSpreadFunction, styled  } from '@tamagui/core';

type GetVariantAcceptedValues<V> = V extends Object
  ? {
      [Key in keyof V]?: V[Key] extends VariantSpreadFunction<any, infer Val>
        ? Val
        : GetVariantValues<keyof V[Key]>
    }
  : undefined

export const createStyled = (plugins: any) => {
  let styledComponent = <
    ParentComponent extends StylableComponent,
    Variants extends VariantDefinitions<ParentComponent> | void = VariantDefinitions<ParentComponent> | void
  >(
    
    Component: ParentComponent,
    options: GetProps<ParentComponent> & {
    name?: string
    variants?: Variants | undefined
    defaultVariants?: GetVariantAcceptedValues<Variants>
    context?: StyledContext
    acceptsClassName?: boolean
  }
  ) => {
    let newOptions = options;
    for (const pluginName in plugins) {
      newOptions = plugins[pluginName]?.optionsMiddleware(options);
    }

    let Comp = styled(
        Component,
        newOptions,
    );

    for (const pluginName in plugins) {
      if (plugins[pluginName]?.componentMiddleWare) {
        Comp = plugins[pluginName]?.componentMiddleware({
          Comp,
          newOptions,
        });
      }
    }

    return Comp;
  };

  return styledComponent;
};