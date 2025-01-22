{ pkgs, lib, config, inputs, ... }:

let
  unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in
{
  # https://devenv.sh/packages/
  packages = [ pkgs.git unstable.pnpm ];

  # https://devenv.sh/languages/
  languages.javascript = {
    npm.enable = true;
    pnpm = {
      enable = true;
      package = unstable.pnpm;
    };
  };
}
