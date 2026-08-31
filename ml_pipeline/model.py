import segmentation_models_pytorch as smp
import torch

def create_unet_model(encoder_name='resnet34', encoder_weights='imagenet'):
    """
    Creates a UNet model with a pretrained backbone.
    Using resnet34 provides a good balance between speed and accuracy.
    """
    model = smp.Unet(
        encoder_name=encoder_name,        # choose encoder, e.g. mobilenet_v2 or efficientnet-b7
        encoder_weights=encoder_weights,  # use `imagenet` pre-trained weights for encoder initialization
        in_channels=3,                    # model input channels (1 for gray-scale images, 3 for RGB)
        classes=1,                        # model output channels (number of classes in your dataset)
        activation=None                   # Return raw logits, we apply sigmoid in loss function / inference
    )
    return model
