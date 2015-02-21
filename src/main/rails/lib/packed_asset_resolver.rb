class PackedAssetResolver

  ASSET_CACHE = {}

  def self.packed_asset_host
    @packed_asset_host ||= Rails.configuration.packed_asset_host
  end

  def self.use_packed_assets
    @use_packed_assets ||= Rails.configuration.use_packed_assets
  end

  def self.packed_asset_path_for(asset_name)
    return nil if asset_name.nil?
    ASSET_CACHE[asset_name.to_sym] ||= resolve_asset_for_sym(asset_name)
  end

  def self.resolve_asset_for_sym(asset_name)
    return "/#{packed_asset_map[asset_name]}" if use_packed_assets

    "/assets/#{asset_name}.js"
  end

  def self.packed_asset_file_root
    @packed_asset_file_route ||= (
      Rails.configuration.packed_asset_file_root || Rails.root.join('public')
    )
  end

  def self.packed_asset_map
    @packed_asset_map ||= begin

      assets_map_file_path = File.join(packed_asset_file_root, 'assets.json')

      unless File.exists?(assets_map_file_path)
         raise "Rails is configured to use packed assets,
                but #{assets_map_file_path} is not present!"
      end

      JSON.parse(File.read(assets_map_file_path))
    end
  end

end